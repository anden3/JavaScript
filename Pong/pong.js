//Saving the canvas and its content to variables
var canvas = document.getElementById("canv");
var ctx = canvas.getContext("2d");

//Initial position and speed of ball
var ballX = 395, ballY = 295;
var ballVX = 2, ballVY = 1;

//Y-values and speed for paddles
var p1Y = 300, p1VY = 0;
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
        ctx.arc(ballX, ballY, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
    ctx.closePath();

    //Moving the ball
    ballX += ballVX;
    ballY += ballVY;

    //Right edge col-detection
    if(ballX >= 795) {
        p1S += 1;
        soundMiss.play();
        resetBall();
    }
    //Left edge col-detection
    if(ballX <= 5) {
        p2S += 1;
        soundMiss.play();
        resetBall();
    }
    //Bottom and top edge col-detection
    if(ballY >= 595 || ballY <= 5) {
        soundWall.play();
        ballVY *= -1;
    }
    //Paddle 1 col-detection
    if(Math.abs(ballX - 20) <= 10 && Math.abs(ballY - (p1Y + 50)) <= 50) {
        soundPaddle.play();
        ballVX *= -1;
    }
    //Paddle 2 col-detection
    if(Math.abs(ballX - 780) <= 10 && Math.abs(ballY - (p2Y + 50)) <= 50) {
        soundPaddle.play();
        ballVX *= -1;
    }
}

var paintRect = function() {
    //Drawing the paddles
    ctx.fillRect(15, p1Y, 10, 100);
    ctx.fillRect(775, p2Y, 10, 100);

    //Moving the left paddle
    p1Y += p1VY;

    //Drawing the dashed center line
    ctx.beginPath();
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 20;
        ctx.setLineDash([21]);

        ctx.moveTo(400, -3);
        ctx.lineTo(400, 600);
        ctx.stroke();
    ctx.closePath();
}

var paintText = function() {
    //Drawing the score displays
    ctx.font = "100px monospace";
    ctx.fillText(p1S, 300, 100);
    ctx.fillText(p2S, 440, 100);
}

var update = function() {
    //Clearing the canvas
    ctx.clearRect(0, 0, 800, 600);

    //Calling all drawing functions
    paintRect();
    paintBall();
    paintText();
}

var resetBall = function() {
    //Setting ball spawn location to the center of the canvas
    ballX = 395;
    ballY = 295;

    //Setting ball speeds to random values between -2 and 2
    ballVX = Math.random() * (2 + 2 + 1) - 2;
    ballVY = Math.random() * (2 + 2 + 1) - 2;
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
            p1VY = -5;
        }
    }
    //Checking if 'S' or 'DownArrow' is being pressed
    if(e.keyCode === 83 || e.keyCode === 40) {
        //Only moves the paddle if it's not at the bottom already
        if(p1Y >= 500) {
            p1VY = 0;
        }
        else {
            //Moves the paddle downwards
            p1VY = 5;
        }
    }
}

var keyUp = function(e) {
    //Checking if one of the movement keys have been released, and if so, stops the paddle.
    if(e.keyCode === 87 || e.keyCode === 83 || e.keyCode === 38 || e.keyCode === 40) {
        p1VY = 0;
    }
}

var mouseMove = function(e) {
    //Saves the mouses Y-coordinate to p2Y; the value is decreased by 50 so the middle of the paddle is stuck to the cursor, rather than the top
    p2Y = e.clientY - 50;
}

//Calls the update function sixty times per second
window.setInterval(update, 1000 / 60);
