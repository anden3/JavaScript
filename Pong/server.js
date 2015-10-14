var gameport = process.env.PORT || 4004,
    verbose = false,

    UUID = require('node-uuid'),
    app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

var players = [];

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.get('/*', function(req, res, next) {
	var file = req.params[0];
	
	if (verbose) {
		console.log('\t :: Express :: file requested : ' + file);
	}
	
	res.sendFile(__dirname + '/' + file);
});

io.use(function(socket, next) {
    var handshake = socket.request;
    next();
});

io.on('connection', function(client) {
	client.userid = UUID();

	client.emit('onconnected', { id: client.userid });
	
	console.log('\t socket.io:: player ' + client.userid + ' connected');
	
    client.once('disconnect', function() {
    	console.log('\t socket.io:: client disconnected ' + client.userid);
        client.emit('disconnect');

        for (var i = 0; i < players.length; i++) {
            if (client.userid === players[i].id) {
                players.splice(i, 1);
            }
        }
 	});

    client.on('new player', function (msg) {
        var y_pos = msg.y,
            dimX = msg.dimX,
            dimY = msg.dimY;

        if (players.length === 0) {
            players.push({x: Math.round(dimY/96), y: y_pos, id: client.userid, player: 1});
        }

        else if (players.length === 1 && players[0].player === 1) {
            players.push({x: Math.round(dimY - (dimY / 57.6)), y: y_pos, id: client.userid, player: 2});
            io.emit('players ready', {object: players});
        }

        else if (players.length === 1 && players[0].player === 2) {
            players.unshift({x: Math.round(dimY/96), y: y_pos, id: client.userid, player: 1});
            io.emit('players ready', {object: players});
        }
    });
    
    client.on('player move', function (msg) {
        var moving;

        if (msg.id === players[0].id) {
            players[0].y = msg.y;
            moving = true;
        }

        else if (msg.id === players[1].id) {
            players[1].y = msg.y;
            moving = true;
        }

        if (moving) {
            updatePos();
        }
    });
});

var updatePos = function () {
    io.emit('new pos', {players: players});
}

http.listen(gameport, function () {
	console.log('listening on *:' + gameport);
});
