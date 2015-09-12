var canvas = document.getElementById("canv");
var ctx = canvas.getContext("2d");

var ballX = 300, ballY = 350;
var ballVX = 2, ballVY = 1;

var p1Y = 300, p1VY = 0;
var p2Y = 0;

var paintBall = function() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(255, 0, 150, 0.9)";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#B2B200";
    ctx.stroke();
    ctx.closePath();

    ballX += ballVX;
    ballY += ballVY;

    //Right and left edge
    if(ballX >= 795 || ballX <= 5) {
        ballVX *= -1;
    }
    //Bottom and top edge
    if(ballY >= 595 || ballY <= 5) {
        ballVY *= -1;
    }
    //Paddle collision detection
    if(Math.abs(ballX - 20) <= 10 && Math.abs(ballY - (p1Y + 50) <= 50)) {
        ballVX *= -1;
    }
    if(Math.abs(ballX - 780) <= 10 && Math.abs(ballY - (p2Y + 50) <= 50)) {
        ballVX *= -1;
    }
}

var paintRect = function() {
    ctx.fillRect(15, p1Y, 10, 100);
    ctx.fillRect(775, p2Y, 10, 100);
    p1Y += p1VY;
}

var update = function() {
    ctx.clearRect(0, 0, 800, 600);
    paintRect();
    paintBall();
}

var keyDown = function(e) {
    if(e.keyCode === 87 || e.keyCode === 38) {
        if(p1Y <= 0) {
            p1VY = 0;
        }
        else {
            p1VY = -5;
        }
    }
    if(e.keyCode === 83 || e.keyCode === 40) {
        if(p1Y >= 500) {
            p1VY = 0;
        }
        else {
            p1VY = 5;
        }
    }
}

var keyUp = function(e) {
    if(e.keyCode === 87 || e.keyCode === 83 || e.keyCode === 38 || e.keyCode === 40) {
        p1VY = 0;
    }
}

var mouseMove = function(e) {
    p2Y = e.clientY - 50;
}

window.setInterval(update, 1000 / 60);
