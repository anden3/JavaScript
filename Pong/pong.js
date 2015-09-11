var canvas = document.getElementById("canv");
var ctx = canvas.getContext("2d");

var ballX = 300;

var paintBall = function() {
    ctx.clearRect(0, 0, 800, 600);
    ctx.beginPath();
    ctx.arc(ballX, 300, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(255, 0, 150, 0.9)";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#B2B200";
    ctx.stroke();
    ctx.closePath();

    ballX += 1;
}

paintBall();

window.setInterval(paintBall, 1000 / 60);
