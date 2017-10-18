var express = require('express');
var path = require('path');
var app = express();

let serverforDocs = require('./etherpad-lite/node_modules/ep_etherpad-lite/node/server.js')
let serverforCanvas = require('./canvas/server.js');


//app.set("view engine", "ejs");
app.use(express.static(__dirname));

app.get('/',function (req,res) {
});


var server = app.listen(3000, function(){
    console.log('3000번 포트로 서버를 시작합니다!'); });


//server for docs
serverforDocs.serverforDocs();

//sever for canvas(module)
serverforCanvas.SocketioServer(server);

