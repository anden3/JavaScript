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

io.on('connection', function(client) {
	client.userid = UUID();

	client.emit('onconnected', { id: client.userid });
	
	console.log('\t socket.io:: player ' + client.userid + ' connected');
	
    client.once('disconnect', function() {
    	console.log('\t socket.io:: client disconnected ' + client.userid);
        for (var i = 0; i < players.length; i++) {
            if (client.userid === players[i].id) {
                players.splice(i, 1);
            }
        }
 	});
    
    client.on('player move', function (msg) {
        if (msg.id === players[0].id) {
            client.emit('new pos', {x: 15, y: msg.y});
        } else if (msg.id === players[1].id) {
            client.emit('new pos', {x: 1425, y: msg.y});
        }
    });

    client.on('new player', function (msg) {
        var y_pos = msg.y;
        io.emit('player id', client.userid);
        if (players.length === 0) {
            players.push({x: 15, y: y_pos, id: client.userid});
        } else if (players.length === 1) {
            players.push({x: 1425, y: y_pos, id: client.userid});
            io.emit('players ready', {players: players});
        }
    });
});

http.listen(gameport, function(){
	console.log('listening on *:' + gameport);
});
