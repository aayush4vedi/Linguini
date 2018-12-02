const ffmpeg = require('fluent-ffmpeg');
/**
 *    input - string, path of input file
 *    output - string, path of output file
 *    callback - function, node-style callback fn (error, result)        
 */
async function convertVid2Aud(input, output) {
    return new Promise((resolve,reject)=>{
        ffmpeg(input)
        .output(output)
        .on('end', function() {
            resolve(true);
        }).on('error', function(err){
            reject(err);
        }).run();
    });
}

module.exports.convertVid2Aud = convertVid2Aud;