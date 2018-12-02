const exec = require("child_process").exec;
async function execute(command) {
    return new Promise((resolve, reject) => {
        exec(command, (err,stdout) => {
            if (err) {
                reject(err);
            }
            resolve(true);
        });
    });
}

async function convert(input,output){
    return execute(`sox -t mp3 - -t flac - rate 16k < ${input} > ${output}`)
}

module.exports.convert = convert;