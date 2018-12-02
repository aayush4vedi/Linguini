const express= require('express');
const path = require("path");
const bodyParser= require('body-parser')
const app = express()
var fs = require('fs');
const aws = require('aws-sdk');
const formidableMiddleware = require('express-formidable');
const main = require('./googleClient').main;
app.use('/upload',formidableMiddleware());
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
const dictionary = require('./dictionary');

const {BUCKET_NAME,PATH,SUFFIX,USER_ID} = require('./config');


app.get('/', (req, res) => {
    res
    .render('home');
});


app.post('/listing', (req, res) => {
    console.log('Displaying List');
    const uID=req.body['user-id'];
    console.log("body", req.body);
    
    console.log("userId is: ",uID);
    (async function () {
        try{
            aws.config.setPromisesDependency();
            console.log("path: ",PATH +"/"+ uID +"/" +SUFFIX);
            const s3= new aws.S3();
            const response = await s3.listObjectsV2({
                Bucket: BUCKET_NAME,
                Prefix: PATH +"/"+ uID +"/" +SUFFIX
            }).promise();
            console.log("response",response);            
            let list = response.Contents;

            list.shift();
            list = list.map(l=>{
                    l.Key = l.Key.split("/").pop();
                    return l;
                }).filter(({Key})=>Key.split(".").pop()!="json");
            res.render('list', {list:list});
    
        }catch(e){
            res.sendFile(__dirname + '/404.html');
            console.log('error: ',e);
            
        }
    })();

    
});
app.get('/download', async function(req, res){
    var key=req.query['Key'];
    key = PATH +"/"+ USER_ID +"/" +SUFFIX +"/"+ key
    console.log('Trying to download file', key);
    var s3 = new aws.S3();
    var options = {
        Bucket: BUCKET_NAME,
        Key    : key,
    };

    res.attachment(key);
    var fileStream = s3.getObject(options).createReadStream();
    fileStream.pipe(res);
    console.log('Download Complete!');
    
});

app.post('/dashboard', (req, res) => {
    console.log('On Dashboard');
    const uID=req.body['user-id'];
    console.log("body", req.body);

    console.log(uID);
    (async function () {
        try{
            aws.config.setPromisesDependency();

            console.log("path: ",PATH +"/"+ uID +"/" +SUFFIX);
            const s3= new aws.S3();
            const response = await s3.listObjectsV2({
                Bucket:BUCKET_NAME,
                Prefix: PATH +"/"+ uID +"/" +SUFFIX
            }).promise();
            console.log("response",response);            
            const list = response.Contents;
            list.shift();
            res.send(list.map(l=>{
                l.Key = l.Key.split("/").pop();
                return l;
            }).filter(({Key})=>Key.split(".").pop()!="json"));
    
        }catch(e){
            res.sendFile(__dirname + '/404.html');
            console.log('error: ',e);
        }
    })();

    
});

app.post('/upload',(req,res)=>{
    console.log('upload initiated');
    console.log("............Files:: ",req.files);
    
    var uri = req.files.uri;
    console.log("uri: ",uri);
    
    var fileName = req.fields.title;
    console.log('fileName: ',fileName);

    
    const s3 = new aws.S3();
    var bucket = BUCKET_NAME;
    fs.readFile(uri.path,(err,data)=>{
        if(err){
            console.log("err in reading file : ",err);
        }else{
            params = {Bucket: bucket, Key: PATH +"/"+ USER_ID +"/" +SUFFIX +"/"+fileName+".mp4", Body: data };
            s3.putObject(params, function(err, data) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("Successfully uploaded video!");
                }
            });
        }
    })
    
    main(uri.path).catch(console.error).then(words=>{
        const buffer = Buffer.from(JSON.stringify(words));
        params = {Bucket: bucket, Key: PATH +"/"+ USER_ID +"/" +SUFFIX +"/"+fileName+".json", Body: buffer };
        s3.putObject(params, function(err, data) {
            if (err) {
                console.log(err)
            } else {
                console.log("Successfully uploaded subs!");
            }
         });
    });
});



app.listen(3000, ()=>{
    console.log("Server running at: 3000");
    
});

