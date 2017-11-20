var express = require('express');
var https = require('https');
var fs = require('fs');
var app = express();

//app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

app.get('/',function (req,res) {
});

var userWholeList = [] //for chamber and user id
var clients = []; //for get admin(방장), save socket id

var port = 3001;
app.set('port', port);

var options = {
    key: fs.readFileSync('../cert/key.pem'),
    cert: fs.readFileSync('../cert/cert.pem')
};
var server = https.createServer(options, app);
server = server.listen(port, function () {
    console.log('Canvas Server Start! https://localhost:3001');
});


// var server = app.listen(3001, function(){
//     console.log('3000번 포트로 서버를 시작합니다!, try at localhost:3000'); });

var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
    //console.log("유저 입장");
    var user_data;
    var res = [];

    socket.on('joined', function(joined_data){
        user_data = joined_data;
        socket.join(user_data.chamber); //소속된 챔버에 조인
        var clients = io.sockets.adapter.rooms[user_data.chamber];

        if(clients) {
            Object.keys(clients.sockets).forEach( function(socketId){
                console.log("Chamber Room client socket Id : " + socketId );
            });
        }


        //var firstclient = sentence.split('&')[0];
        //console.log("해당 룸의 첫번째 유저 : " + firstclient);

        // //var master = clients.slice(1);
        //
        // var roomMembers = [];
        // var nsp = (typeof _nsp !== 'string') ? '/' : _nsp;
        //
        // for( var member in io.nsps[nsp].adapter.rooms[user_data.chamber].sockets ) {
        //     roomMembers.push(member);
        //     console.log(member);
        // }


        //userWholeList.push(user_data);

        //clients.push(socket.id); //client[0], admin을 구하기 위해
        console.log(user_data.user_id + "유저가 "+ user_data.chamber + "방에 입장했습니다.");

        //socket.emit('changeUserState', userWholeList); //자기자신에게
        //socket.broadcast.emit('changeUserState', userWholeList); //자기 자신을 제외한 유저에게

        // if(userWholeList.length > 1) {
        //     io.sockets.connected[clients[0]].emit('SendRecentData');
        // }
    });

    socket.on('linesend', function (data) {
        //console.log(data);
        io.sockets.in(data.chamber).emit('linesend_toclient',data);
        //socket.broadcast.emit('linesend_toclient',data);
        //io.to('').emit('join', data);
    });

    socket.on('load',  function (data) {
        //console.log(data.dataURL);
        io.sockets.in(data.chamber).emit('load_data',data);
        console.log("소켓 전달");
    });

    socket.on('undo',  function (data) {
        io.sockets.in(data.chamber).emit('Undo');
        console.log("실행 취소");
    });

    socket.on('redo',  function (data) {
        io.sockets.in(data.chamber).emit('Redo');
        console.log("재실행");
    });

    socket.on('disconnect', function () {
        //console.log("유저 퇴장");
        //var i = userWholeList.indexOf(user_data);
        //console.log(user_data.chamber + "방의 "+ user_data.user_id + "님이 퇴장하셨습니다");
        //userWholeList.splice(i,1);
        //clients.splice(i,1);

        //socket.broadcast.emit('changeUserState', userWholeList);
    });
});

