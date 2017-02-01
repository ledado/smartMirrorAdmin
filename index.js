/**
 * Created by andrej on 1/23/17.
 */

var express = require('express');
// var app = express();

// app.set('port', (process.env.PORT || 5000));


// var https = require('https').Server(app);
// var io = require('socket.io')(https);




// var app    = require('express')();
// var server = app.listen(app.get('port'), function () {
//     console.log('server listening on port ' + server.address().port);
// });
// var io = require('socket.io')(server);


var app = express();
var http = require( "https" ).Server( app );
var io = require( "socket.io" )( http );
http.listen(8080, "127.0.0.1");


// var app = require('express')();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);
// var PORT = process.env.PORT || 8080;
// app.set('port', (process.env.PORT || 3000));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
var room = {
    id : 0
};
var usedTokens = {
    "k5sd4dfdg": 1,
    "sdfsdf": 1,
}

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.on('join', function (data) {
        console.log("token: "+data["token"])

        socket.join(data["token"]);
        room.id = data["token"];

        if(data["isController"]){
            var status = 1;
            if(usedTokens[data["token"]] == 1){
                var obj ={

                };
                io.to(room.id).emit('update', obj);
            }else{
                status = "0"
            }
            var obj = {
                status: status
            };
            io.to(room.id).emit('existRoom', obj);
        }



    });
    socket.on('existRoom', function (roomId) {

        console.log("exist room id:"+io.sockets.adapter.sids[socket.id][roomId])
    });
    socket.on('update', function(msg){
        var obj ={

        };
        console.log("update")
        io.to(room.id).emit('update', obj);
    });
    socket.on('setUpdate', function(obj){
        console.log("setupdate")
        io.to(room.id).emit('setUpdate', obj);
    });
    socket.on('displayTime', function(msg){
        var obj ={
            status: msg
        };

        io.to(room.id).emit('displayTime', obj);
    });
    socket.on('displayDate', function(msg){
        var obj ={
            status: msg
        };

        io.to(room.id).emit('displayDate', obj);
    });

    socket.on('displayRssFeed', function(url){
        var obj ={
            status: url
        };

        io.to(room.id).emit('displayRssFeed', obj);
    });
    socket.on('display24Format', function(msg){
        var obj ={
            status: msg
        };

        io.to(room.id).emit('display24Format', obj);
    });
    socket.on('rssFeedUrl', function(url){
        console.log('rss feed url: ' + url);
        var obj ={
            url: url
        };

        io.to(room.id).emit('rssFeedUrl', obj);
    });
    socket.on('setDateFormatType', function(type){
        var obj ={
            type: type
        };

        io.to(room.id).emit('setDateFormatType', obj);
    });

});

// http.listen(PORT, function(){
//     console.log('listening on *:3000');
// });

// app.listen(app.get('port'), function() {
//     console.log('Node app is running on port', app.get('port'));
// });