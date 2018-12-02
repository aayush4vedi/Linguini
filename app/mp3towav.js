const Lame = require("node-lame").Lame;

async function encodeMp3(input,output){
    const encoder = new Lame({
        output: output,
        bitrate: 16,
        mode:   "m"
    }).setFile(input);
    return encoder.encode();    
}

module.exports.encodeMp3 = encodeMp3;