# Linguini 
<!-- About -->
A service to handle video upload and keyword detection in it using Google Speech API.
## Linguini-app
A React Native app for user. 
**Screens:**
- Video Screen: Record, play, delete & upload a video.
- Dashboard Screen: Renders the list of local & uploaded videos.
## Linguini-service
An admin side web-app written in NodeJS. 
**Features:**
- Display the list of videos of given UserID.
- Detecting *keywords* from [dictionary.js](https://github.com/NestAway/linguini/blob/staging/app/dictionary.js) using **Google Speech API**.
- A built-in video player with *play-from* functionality for every detected keyword.
<!-- Demo & podID -->
# Demo
Click [here](https://github.com/NestAway/linguini/blob/staging/demo/appDemo.mp4) for user-app demo & [here](https://github.com/NestAway/linguini/blob/staging/demo/sampeSAV.mp4) for admin's web-app demo.

**Url for Staging**: `http://linguini-service.staging.k8s.nestaway.xyz:31758`

<!-- Google Speech config -->
## Google Speech API config
Please make sure to have the following configuration while using Google Text-to-Speech API:
```javascript
config = {
      "diarizationSpeakerCount": 1,
      "enableAutomaticPunctuation": true,
      "enableSpeakerDiarization": true,
      "encoding": "FLAC",
      "languageCode": "en-US",
      "model": "video",
      "sampleRateHertz": 16000,
      "enableWordTimeOffsets":true
      };
```
 <!-- Design  -->
## Design
 
![alt text](https://github.com/NestAway/linguini/blob/staging/demo/linguiniDesign.png "linguini system desing")    
Read the attached [doc](https://github.com/NestAway/linguini/blob/staging/demo/linguiniDoc.pdf) for details.
