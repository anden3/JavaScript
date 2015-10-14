var gameport = process.env.PORT || 4004,
    verbose = false,

    UUID = require('node-uuid'),
    app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

var players = [],
    ballX,
    ballY,
    ballVX,
    ballVY,
    ballResX,
    ballResY;

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
            players.push({x: Math.round(dimY/96), y: y_pos, id: client.userid, player: 1, resX: dimX, resY: dimY, score: 0});
        }

        else if (players.length === 1 && players[0].player === 1) {
            players.push({x: Math.round(dimY - (dimY / 57.6)), y: y_pos, id: client.userid, player: 2, resX: dimX, resY: dimY, score: 0});
            io.emit('display score', players);
            io.emit('players ready', {object: players});
        }

        else if (players.length === 1 && players[0].player === 2) {
            players.unshift({x: Math.round(dimY/96), y: y_pos, id: client.userid, player: 1, resX: dimX, resY: dimY, score: 0});
            io.emit('display score', players);
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

    client.on('new ball', function (msg) {
        resetBall(msg);
    });
});

var updatePos = function () {
    io.emit('new pos', {players: players});
}

var resetBall = function (msg) {
    //Saving a value of either -1 or 1 to a variable
    var posOrNeg = Math.random() < 0.5 ? -1 : 1;

    if (typeof msg !== "undefined") {
        dimX = msg.resX;
        dimY = msg.resY;
    }

    ballX = dimY/2 - dimY/288;
    ballY = dimX/2 - dimX/160;

    //Setting ball speeds to random values between 1 and 5, and multiplies it by either 1 or -1
    ballVX = posOrNeg * (Math.random() * (2 - 1) + 1);
    ballVY = posOrNeg * (Math.random() * (2 - 1) + 1);

    paintBall(dimX, dimY);

    ballLoop = setInterval(paintBall, 50 / 3);
}

var paintBall = function (resX, resY) {
    if (typeof resX !== "undefined") {
        ballResX = resX;
        ballResY = resY;
    }

    //Right edge col-detection
    if(ballX >= ballResY - ballResY/160) {
        players[0].score += 1;
        io.emit('display score', players);
        clearInterval(ballLoop);
        resetBall();
    }
    //Left edge col-detection
    if(ballX <= ballResY/288) {
        players[1].score += 1;
        io.emit('display score', players);
        clearInterval(ballLoop);
        resetBall();
    }
    //Bottom and top edge col-detection
    if(ballY >= ballResX - ballResX/160 || ballY <= ballResX/160) {
        ballVY *= -1;
    }
    //Paddle 1 col-detection
    if(Math.abs(ballX - ballResY/72) <= ballResY/144 && Math.abs(ballY - (players[0].y + ballResX/16)) <= ballResX/16) {
        ballVX *= -1;
    }
    //Paddle 2 col-detection
    if(Math.abs(ballX - (ballResY - ballResY/72)) <= ballResY/144 && Math.abs(ballY - (players[1].y + ballResX/16)) <= ballResX/16) {
        ballVX *= -1;
    }

    //Moving the ball
    ballX += ballVX;
    ballY += ballVY;

    io.emit('paint ball', {x: ballX, y: ballY});
}

http.listen(gameport, function () {
	console.log('listening on *:' + gameport);
});
