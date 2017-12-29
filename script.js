const express = require('express');
const multer  = require('multer');
const child_process  = require('child_process');
const fs = require('fs');
const app = express();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './program')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage: storage });

app.set('view engine','hbs');
const hbs = require('hbs');

app.use('/public',express.static(__dirname+'/public'))

app.get('/',(req,res)=>{
    res.render('index');
});

app.post('/',upload.single('avatar'),(req,res,next)=>{

    let result = child_process.spawnSync('g++',[__dirname+'/program/'+req.file.filename]);
    fs.writeFileSync(__dirname+'/in.txt',req.body.input);
    if(result.stderr.toString()!==""){
        res.render('index',{output: result.stderr.toString()})
    }
    else {

        child_process.spawnSync('./a.out', ['< in.txt', '> out.txt'], {
            shell: true
        });
        res.render('index', {input:fs.readFileSync(__dirname+'/in.txt'),output: fs.readFileSync(__dirname + '/out.txt')});
    }

})

const PORT = process.env.PORT || 1234;

app.listen(PORT,()=>{
    console.log("server started listening on http://localhost:"+PORT);
});
