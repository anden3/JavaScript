//Saving the canvas and its content to variables
var paddle_canvas = document.getElementById("pdl_canv");
var pdl_ctx = paddle_canvas.getContext("2d");

var ball_canvas = document.getElementById("bal_canv");
var bal_ctx = ball_canvas.getContext("2d");

var text_canvas = document.getElementById("txt_canv");
var txt_ctx = text_canvas.getContext("2d");

//Setting the canvas dimensions to the maximum avaliable size within the window
pdl_ctx.canvas.width = window.innerWidth;
pdl_ctx.canvas.height = window.innerHeight;

bal_ctx.canvas.width = window.innerWidth;
bal_ctx.canvas.height = window.innerHeight;

txt_ctx.canvas.width = window.innerWidth;
txt_ctx.canvas.height = window.innerHeight;

//Adding event handlers for the keys and mouse
document.getElementById("main").addEventListener("keydown", function(){ keyDown(event); });

//Setting the height and width of the canvas to variables
var dimX = pdl_ctx.canvas.height, dimY = pdl_ctx.canvas.width;

//Defining variables for position and speed of ball
var ballX = 0, ballY = 0;
var ballVX = 0, ballVY = 0;

//Y-values and speed for paddles
var pY = 300, pVY = 20;

socket = io.connect("http://macs-air.lan:4004");

var id,
    id_set = false,
    scaleSet = false,
    players = [];

socket.on("onconnected", function (msg) {
    console.log("Connected to socket server");

    if (id_set === false) {
        id = msg.id;
        id_set = true;
    }

    socket.emit('new player', {y: pY, dimX: dimX, dimY: dimY});
});

socket.on("disconnect", function () {
    console.log("Disconnected from socket server");
    id = "";
    id_set = false;
});

socket.on('players ready', function (msg) {
    players = msg.object;

    if (!scaleSet) {
        if (players[0].id === id) {
            var resX = players[0].resX;
            var resY = players[0].resY;

            var p2resX = players[1].resX;
            var p2resY = players[1].resY;
        }

        pdl_ctx.scale(resY/p2resY, resX/p2resX);
        bal_ctx.scale(resY/p2resY, resX/p2resX);

        scaleSet = true;
    }

    pdl_ctx.clearRect(0, 0, dimY, dimX);

    pdl_ctx.fillStyle = "white";
    pdl_ctx.fillRect(players[0].x, players[0].y, dimY/144, dimX/8);
    pdl_ctx.fillRect(players[1].x, players[1].y, dimY/144, dimX/8);

    socket.emit('new ball', {resX: dimX, resY: dimY});
});

socket.on('display score', function (msg) {
    txt_ctx.clearRect(0, 0, dimY, dimX);

    //Drawing the score displays
    txt_ctx.font = dimX/8 + "px monospace";
    var textLength = txt_ctx.measureText(msg[0].score).width;

    txt_ctx.fillStyle = "white";
    txt_ctx.fillText(msg[0].score, dimY/2 - (textLength + dimY/36), dimX/6);
    txt_ctx.fillText(msg[1].score, dimY/2 + dimY/36, dimX/6);
});

socket.on('new pos', function (msg) {
    players = msg.players;

    pdl_ctx.clearRect(0, 0, dimY, dimX);

    pdl_ctx.fillStyle = "white";
    pdl_ctx.fillRect(players[0].x, players[0].y, dimY/144, dimX/8);
    pdl_ctx.fillRect(players[1].x, players[1].y, dimY/144, dimX/8);
});

socket.on('spawn ball', function (msg) {
    paintBall(bal_ctx, msg);
});

socket.on('paint ball', function (msg) {
    bal_ctx.clearRect(0, 0, dimY, dimX);

    //Drawing the ball
    bal_ctx.beginPath();
        bal_ctx.arc(msg.x, msg.y, dimX/160, 0, 2 * Math.PI);
        bal_ctx.fillStyle = "#FFFFFF";
        bal_ctx.fill();
    bal_ctx.closePath();
});

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
