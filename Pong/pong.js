//Saving the canvas and its content to variables
var canvas = document.getElementById("canv");
var ctx = canvas.getContext("2d");

//Setting the canvas dimensions to the maximum avaliable size within the window
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

//Adding event handlers for the keys and mouse
document.getElementById("main").addEventListener("keydown", function(){ keyDown(event); });
document.getElementById("main").addEventListener("keyup", function(){ keyUp(event); });
window.addEventListener("resize", function(){ updateDimensions(); });

//Setting the height and width of the canvas to variables
var dimX = ctx.canvas.height, dimY = ctx.canvas.width;

//Defining variables for position and speed of ball
var ballX = 0, ballY = 0;
var ballVX = 0, ballVY = 0;

//Y-values and speed for paddles
var pY = 300, pVY = 5;

//Initial score
var pS = 0;

//Saving sounds to variables
var soundWall = new Audio("http://cs.au.dk/~dsound/DigitalAudio.dir/Greenfoot/Pong.dir/sounds_ping_pong_8bit/ping_pong_8bit_plop.wav");
var soundPaddle = new Audio("http://cs.au.dk/~dsound/DigitalAudio.dir/Greenfoot/Pong.dir/sounds_ping_pong_8bit/ping_pong_8bit_beeep.wav");
var soundMiss = new Audio("http://cs.au.dk/~dsound/DigitalAudio.dir/Greenfoot/Pong.dir/sounds_ping_pong_8bit/ping_pong_8bit_peeeeeep.wav");

socket = io.connect("http://macs-air.lan:4004");

var id,
    id_set = false,
    players = [];

socket.on("onconnected", function (msg) {
    console.log("Connected to socket server");

    if (id_set === false) {
        id = msg.id;
        id_set = true;
    }

    socket.emit('new player', {y: pY, dimX: dimX, dimY: dimY});
});

socket.on("disconnect", onSocketDisconnect);

socket.on('new pos', function (msg) {
    players = msg.players;

    ctx.clearRect(0, 0, dimY, dimX);

    //ctx.fillStyle = "white";
    //ctx.fillRect(players[0].x, players[0].y, dimY/144, dimX/8);
    //ctx.fillRect(players[1].x, players[1].y, dimY/144, dimX/8);
});

socket.on('players ready', function (msg) {
    var p1X = msg.object[0].x,
        p1Y = msg.object[0].y,
        p2X = msg.object[1].x,
        p2Y = msg.object[1].y;

    players = msg.object;

    //ctx.fillStyle = "white";
    //ctx.fillRect(p1X, p1Y, dimY/144, dimX/8);
    //ctx.fillRect(p2X, p2Y, dimY/144, dimX/8);
});

function onSocketDisconnect() {
    console.log("Disconnected from socket server");
    id = "";
    id_set = false;
};

var paintBall = function() {
    //Drawing the ball
    ctx.beginPath();
        ctx.arc(ballX, ballY, dimX/160, 0, 2 * Math.PI);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
    ctx.closePath();

    //Moving the ball
    ballX += ballVX;
    ballY += ballVY;

    //Right edge col-detection
    if(ballX >= dimY - dimY/160) {
        pS += 1;
        //soundMiss.play();
        resetBall();
    }
    //Left edge col-detection
    if(ballX <= dimY/288) {
        //p2S += 1;
        //soundMiss.play();
        resetBall();
    }
    //Bottom and top edge col-detection
    if(ballY >= dimX - dimX/160 || ballY <= dimX/160) {
        //soundWall.play();
        ballVY *= -1;
    }
    //Paddle 1 col-detection
    if(Math.abs(ballX - dimY/72) <= dimY/144 && Math.abs(ballY - (players[0].y + dimX/16)) <= dimX/16) {
        //soundPaddle.play();
        ballVX *= -1;
    }

    //Paddle 2 col-detection
    if(Math.abs(ballX - (dimY - dimY/72)) <= dimY/144 && Math.abs(ballY - (players[1].y + dimX/16)) <= dimX/16) {
        //soundPaddle.play();
        ballVX *= -1;
    }
}

var paintRect = function() {
    if (players.length === 2) {
        var p1X = players[0].x,
            p1Y = players[0].y,

            p2X = players[1].x,
            p2Y = players[1].y;

        //Drawing the paddles
        ctx.fillStyle = "white";
        ctx.fillRect(players[0].x, players[0].y, dimY/144, dimX/8);
        ctx.fillRect(players[1].x, players[1].y, dimY/144, dimX/8);
    }

    /*
    //Moving the left paddle
    p1Y += p1VY;

    //Drawing the center line
    ctx.beginPath();
        //Setting the style of the line
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = dimX/40;
        ctx.setLineDash([dimX/40]);

        //Drawing the line
        ctx.moveTo(dimY/2, -3);
        ctx.lineTo(dimY/2, dimX);
        ctx.stroke();
    ctx.closePath();
    */
}

/*
var paintText = function() {
    //Drawing the score displays
    ctx.font = dimX/8 + "px monospace";
    var textLength = ctx.measureText(pS).width;
    ctx.fillText(pS, dimY/2 - (textLength + dimY/36), dimX/6);
    //ctx.fillText(p2S, dimY/2 + dimY/36, dimX/6);
}
*/

var update = function() {
    //Clearing the canvas
    //ctx.clearRect(0, 0, dimY, dimX);

    //Calling all drawing functions
    //paintBall();
    paintRect();
    //paintText();

    requestAnimationFrame(update);
}

var updateDimensions = function() {
    //Setting the canvas dimensions to the maximum available size within the window
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    //Setting the height and width of the canvas to variables
    dimX = ctx.canvas.height;
    dimY = ctx.canvas.width;
}

var resetBall = function() {
    //Setting ball spawn location to the center of the canvas
    ballX = dimY/2 - dimY/288;
    ballY = dimX/2 - dimX/160;

    //Saving a value of either -1 or 1 to a variable
    var posOrNeg = Math.random() < 0.5 ? -1 : 1;

    //Setting ball speeds to random values between 1 and 5, and multiplies it by either 1 or -1
    //ballVX = posOrNeg * (Math.random() * ((dimY/288) - (dimY/1440)) + (dimY/1440));
    //ballVY = posOrNeg * (Math.random() * ((dimX/160) - (dimX/800)) + dimX/800);
    ballVX = posOrNeg;
    ballVY = posOrNeg;
    //update();
}

var keyDown = function(e) {
    //Checking if 'W' or 'UpArrow' is being pressed
    if(e.keyCode === 87 || e.keyCode === 38) {
        if (players[0].id === id) {
            var pY = players[0].y;
        }

        else {
            var pY = players[1].y;
        }

        socket.emit('player move', {y: pY - pVY, id: id});
    }
    //Checking if 'S' or 'DownArrow' is being pressed
    if(e.keyCode === 83 || e.keyCode === 40) {
        if (players[0].id === id) {
            var pY = players[0].y;
        }

        else {
            var pY = players[1].y;
        }

        socket.emit('player move', {y: pY + pVY, id: id});
    }
}

var keyUp = function(e) {
    //Checking if one of the movement keys have been released, and if so, stops the paddle.
    if(e.keyCode === 87 || e.keyCode === 83 || e.keyCode === 38 || e.keyCode === 40) {
        //p1VY = 0;
    }
}

//Setting the initial position and speed of the ball
resetBall();

//Calls the update function sixty times per second
update();
