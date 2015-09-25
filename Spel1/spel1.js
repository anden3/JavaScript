//Saving the canvas and its content to variables
var canvas = document.getElementById("canv");
var ctx = canvas.getContext("2d");

//Setting the canvas dimensions to the maximum available size within the window
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

//Setting the height and width of the canvas to variables
var dimX = ctx.canvas.width, dimY = ctx.canvas.height;

//Adding event handlers for the keys
document.getElementById("main").addEventListener("keydown", function(){ keyDown(event); });
//document.getElementById("main").addEventListener("keyup", function(){ keyUp(event); });

//Returns random values X and Y-values
var randPos = function(axis) {
    return (Math.floor(Math.random() * ((axis - 5) - 5 + 1) + 5));
}

//Adding starting dimensions for the players
var p1X = randPos(dimX), p1Y = randPos(dimY);
var p2X = randPos(dimX), p2Y = randPos(dimY);

//Adding speeds for the players
var p1VX = 0.5, p1VY = 0.5;
var p2VX = 1, p2VY = 0;

//Adding rotations for the players
var p1R = 0, p2R = 0;

var currentRot = 0, currentRot = 0;

//Adding colors for the players
var p1C = ctx.fillStyle = '#' + Math.floor(Math.random() * 16777215).toString(16), p2C = ctx.fillStyle = '#' + Math.floor(Math.random() * 16777215).toString(16);

//Adding scores for the players
var p1S = 0, p2S = 0;

var paintP1 = function() {
    if(p1R > 0) {
        currentRot += 3;

        ctx.translate(p1X, p1Y);
        ctx.rotate(3 * Math.PI / 180);

        ctx.arc(0, 0, 5, 0, Math.PI * 2);

        ctx.strokeStyle = p1C;
        ctx.stroke();

        ctx.translate(-p1X, -p1Y);

        p1R -= 1;

        p1X += p1VX;
        p1Y += p1VY;
    }
    else if(p1R < 0) {
        currentRot -= 3;

        ctx.translate(p1X, p1Y);
        ctx.rotate(-3 * Math.PI / 180);

        ctx.arc(0, 0, 5, 0, Math.PI * 2);

        ctx.strokeStyle = p1C;
        ctx.stroke();

        ctx.translate(-p1X, -p1Y);

        p1R += 1;

        p1X += p1VX;
        p1Y += p1VY;
    }
    else {
        ctx.arc(p1X, p1Y, 5, 0, Math.PI * 2);

        ctx.strokeStyle = p1C;
        ctx.stroke();

        p1X += p1VX;
        p1Y += p1VY;
    }
}

var paintP2 = function() {
    ctx.save();
    ctx.rotate((-1 * currentRot) * Math.PI / 180);

    ctx.arc(p2X, p2Y, 5, 0, Math.PI * 2);

    ctx.fillStyle = p2C;
    ctx.fill();

    ctx.restore();

    p2X += p2VX;
    p2Y += p2VY;
}

var update = function() {
    paintP1();
    paintP2();
}

var keyDown = function(e) {
    console.log(e.keyCode);
    if(e.keyCode === 65) {
        p1R = 5;
    }
    else if(e.keyCode === 68) {
        p1R = -5;
    }
}

//Calls the update function sixty times per second
window.setInterval(update, 50 / 3);
