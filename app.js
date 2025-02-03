const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', (req, res) => {
    fs.readdir('./files', function (err, files) {
        res.render('index', { files: files });
    });
});
app.get('/create',function (req, res) {
    res.render('create');
});
app.get('/edit/:filename', (req, res) => {
    
    fs.readFile(`./files/${req.params.filename}`,'utf-8',function(err,filedata){
        if (err) return res.status(500).send(err);
        res.render('edit',{filedata,filename: req.params.filename})
    });
   
});
app.get('/hisaab/:filename', (req, res) => {
    fs.readFile(`./files/${req.params.filename}`,'utf-8',function(err,filedata){
        if (err) return res.status(500).send(err);
        res.render('hisaab',{filedata,filename : req.params.filename});
    })
   
});
app.get('/delete/:filename', (req, res) => {
    fs.unlink(`./files/${req.params.filename}`,function(err){
        if (err) return res.status(500).send(err);
        res.redirect('/')
    })
   
});
app.post('/update/:filename', (req, res) => {
    fs.writeFile(`./files/${req.params.filename}`,req.body.content,function(err){
        if (err) {
            return res.status(500).send("Kuch galat ho gaya. Hisaab update nahi ho paya.");
        }
        
        res.redirect('/')
    });
   
});
app.post('/createhisaab', function(req, res)  {
    var currentDate = new Date();
    var date =`${currentDate.getDate()}-${currentDate.getMonth()+1}-${currentDate.getFullYear()}`;

    var uniqueName = `${date}-${Date.now()}.txt`; // Har file ka naam unique hoga.
    fs.writeFile(`./files/${uniqueName}`, req.body.content, function (err) {
        if (err) return res.status(500).send(err);
        res.redirect('/');
    })
});

app.listen(3000);






