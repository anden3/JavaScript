//Saving the canvas and its content to variables
var canvas = document.getElementById("canv");
var ctx = canvas.getContext("2d");

//Setting the canvas dimensions to the maximum avaliable size within the window
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

//Adding event handlers for the keys and mouse
document.getElementById("main").addEventListener("keydown", function(){ keyDown(event); });
document.getElementById("main").addEventListener("keyup", function(){ keyUp(event); });
document.getElementById("main").addEventListener("mousemove", function(){ mouseMove(event); });
window.addEventListener("resize", function(){ updateDimensions(); });

//Setting the height and width of the canvas to variables
var dimX = ctx.canvas.height, dimY = ctx.canvas.width;

//Defining variables for position and speed of ball
var ballX = 0, ballY = 0;
var ballVX = 0, ballVY = 0;

//Y-values and speed for paddles
var p1Y = dimX/2 - dimX/16, p1VY = 0;
var p2Y = 0;

//Initial score
var p1S = 0, p2S = 0;

//Saving sounds to variables
var soundWall = new Audio("http://cs.au.dk/~dsound/DigitalAudio.dir/Greenfoot/Pong.dir/sounds_ping_pong_8bit/ping_pong_8bit_plop.wav");
var soundPaddle = new Audio("http://cs.au.dk/~dsound/DigitalAudio.dir/Greenfoot/Pong.dir/sounds_ping_pong_8bit/ping_pong_8bit_beeep.wav");
var soundMiss = new Audio("http://cs.au.dk/~dsound/DigitalAudio.dir/Greenfoot/Pong.dir/sounds_ping_pong_8bit/ping_pong_8bit_peeeeeep.wav");

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
        p1S += 1;
        soundMiss.play();
        resetBall();
    }
    //Left edge col-detection
    if(ballX <= dimY/288) {
        p2S += 1;
        soundMiss.play();
        resetBall();
    }
    //Bottom and top edge col-detection
    if(ballY >= dimX - dimX/160 || ballY <= dimX/160) {
        soundWall.play();
        ballVY *= -1;
    }
    //Paddle 1 col-detection
    if(Math.abs(ballX - dimY/72) <= dimY/144 && Math.abs(ballY - (p1Y + dimX/16)) <= dimX/16) {
        soundPaddle.play();
        ballVX *= -1;
    }
    //Paddle 2 col-detection
    if(Math.abs(ballX - (dimY - dimY/72)) <= dimY/144 && Math.abs(ballY - (p2Y + dimX/16)) <= dimX/16) {
        soundPaddle.play();
        ballVX *= -1;
    }
}

var paintRect = function() {
    //Drawing the paddles
    ctx.fillRect(dimY/96, p1Y, dimY/144, dimX/8);
    ctx.fillRect(dimY - (dimY/57.6), p2Y, dimY/144, dimX/8);

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
}

var paintText = function() {
    //Drawing the score displays
    ctx.font = dimX/8 + "px monospace";
    var textLength = ctx.measureText(p1S).width;
    ctx.fillText(p1S, dimY/2 - (textLength + dimY/36), dimX/6);
    ctx.fillText(p2S, dimY/2 + dimY/36, dimX/6);
}

var update = function() {
    //Clearing the canvas
    ctx.clearRect(0, 0, dimY, dimX);

    //Calling all drawing functions
    paintRect();
    paintBall();
    paintText();
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
    ballVX = posOrNeg * (Math.random() * ((dimY/288) - (dimY/1440)) + (dimY/1440));
    ballVY = posOrNeg * (Math.random() * ((dimX/160) - (dimX/800)) + dimX/800);
    update();
}

var keyDown = function(e) {
    //Checking if 'W' or 'UpArrow' is being pressed
    if(e.keyCode === 87 || e.keyCode === 38) {
        //Only moves the paddle if it's not at the top already (kinda...)
        if(p1Y <= 0) {
            p1VY = 0;
        }
        else {
            //Moves the paddle upwards
            p1VY = -(dimX/160);
        }
    }
    //Checking if 'S' or 'DownArrow' is being pressed
    if(e.keyCode === 83 || e.keyCode === 40) {
        //Only moves the paddle if it's not at the bottom already
        if(p1Y >= dimX - dimX/8) {
            p1VY = 0;
        }
        else {
            //Moves the paddle downwards
            p1VY = dimX/160;
        }
    }
}

var keyUp = function(e) {
    //Checking if one of the movement keys have been released, and if so, stops the paddle.
    if(e.keyCode === 87 || e.keyCode === 83 || e.keyCode === 38 || e.keyCode === 40) {
        p1VY = 0;
    }
}

var mouseMove = function(e) {
    //Saves the mouses Y-coordinate to p2Y; the value is decreased by half of the paddle height so the middle of the paddle is stuck to the cursor, rather than       //the top
    p2Y = e.clientY - dimX/16;
}

//Setting the initial position and speed of the ball
resetBall();

//Calls the update function sixty times per second
window.setInterval(update, 50 / 3);
