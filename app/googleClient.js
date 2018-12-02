const speech = require('@google-cloud/speech');
const fs = require('fs');
const path = require("path");
const convert = require("./mp3ToFlac").convert;
const encoder = require("./mp3towav").encodeMp3;
const convertVidToAud = require("./mp4Tomp3").convertVid2Aud;
const {GCP_SPEECH_PATH,GCP_PROJECT_ID} = require("./config");

const getPath = (name)=>path.join(__dirname, name);

async function main(video) {

  return new Promise(async(resolve,reject)=>{
  
    const client = new speech.SpeechClient({
      keyFilename:GCP_SPEECH_PATH,
      projectId:GCP_PROJECT_ID
    });
  
    const transactionId = Date.now();
    const mp3 = getPath(`audios/temp-${transactionId}.mp3`);
    
    await convertVidToAud(video,mp3);
    console.log('Coverted to mp3');
    const input = getPath(`audios/temp-${transactionId}-encoded.mp3`);
    await encoder(mp3,input);
    console.log('encoded mp3');

    const fileName = getPath(`audios/temp-${transactionId}.flac`);
    await convert(input,fileName);
    console.log('Coverted to flac');  
    const config = {
      "diarizationSpeakerCount": 1,
      "enableAutomaticPunctuation": true,
      "enableSpeakerDiarization": true,
      "encoding": "FLAC",
      "languageCode": "en-US",
      "model": "video",
      "sampleRateHertz": 16000,
      "enableWordTimeOffsets":true
      };
    const request = {
      config: config,
    };
  
    
    const words = [];

    const recognizeStream = client
      .streamingRecognize(request)
      .on('error', (err)=>{
        reject(err);
      })
      .on('data', data => {
        console.log(
          `Transcription: ${data.results[0].alternatives[0].transcript}`
        );
        words.push(...data.results[0].alternatives[0].words);
      })
      .on("end",()=>{
        // fs.unlink(video);
        // fs.unlink(mp3);
        // fs.unlink(input);
        // fs.unlink(fileName);
        resolve(words);
      });

      fs.createReadStream(fileName).pipe(recognizeStream);

    });
      
  }


  module.exports.main=main;