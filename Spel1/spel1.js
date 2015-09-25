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

//Returns random X and Y-values
var randPos = function(axis) {
    return (Math.floor(Math.random() * ((axis - 5) - 5 + 1) + 5));
}

//Returns random hex color
var randColor = function() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

//Adding starting dimensions for the players
var p1X = 0, p1Y = 0;
var p2X = 0, p2Y = 0;

//Adding arrays for storing line areas
var p1P = [[], []], p2P = [[], []];

//Adding speeds for the players
var p1VX = 1, p1VY = 0;
var p2VX = 1, p2VY = 0;

//Adding colors for the players
var p1C = "", p2C = "";

//Adding scores for the players
var p1S = 0, p2S = 0;

//Drawing the score
var drawScore = function() {
    ctx.strokeStyle = "#FFFFFF";
    ctx.strokeText("Player 1: " + p1S, 20, 30);
    ctx.strokeText("Player 2: " + p2S, 20, 50);
}

//Drawing the players
var paintPlayers = function() {
    //Drawing player 1
    ctx.beginPath();
        ctx.arc(p1X, p1Y, 5, 0, Math.PI * 2);

        //Setting the color to a random one
        ctx.strokeStyle = p1C;
        ctx.stroke();
    ctx.closePath();

    //Drawing player 2
    ctx.beginPath();
        ctx.arc(p2X, p2Y, 5, 0, Math.PI * 2);

        //Setting the color to a random one
        ctx.strokeStyle = p2C;
        ctx.stroke();
    ctx.closePath();

    //Adding player 1 coords to array
    p1P[0].push(p1X);
    p1P[1].push(p1Y);

    //Moving player 1
    p1X += p1VX;
    p1Y += p1VY;

    //Adding player 2 coords to array
    p2P[0].push(p2X);
    p2P[1].push(p2Y);

    //Moving player 2
    p2X += p2VX;
    p2Y += p2VY;
}

var reset = function() {
    //Clearing up from last game
    ctx.clearRect(0, 0, dimX, dimY);

    //Drawing the score
    drawScore();

    //Adding starting dimensions for the players
    p1X = randPos(dimX), p1Y = randPos(dimY);
    p2X = randPos(dimX), p2Y = randPos(dimY);

    //Adding arrays for storing line areas
    p1P = [[p1X], [p1Y]], p2P = [[p2X], [p2Y]];

    //Adding colors for the players
    p1C = randColor(), p2C = randColor();
}

//Checking for collisions
var colDetection = function() {
    for(var i = 0; i < p1P[0].length; i++) {
        //Player 2 into player 1
        if(p1P[0][i] === p2X && p1P[1][i] === p2Y) {
            p1S += 1;
            reset();
        }
        //Player 1 into player 2
        if(p2P[0][i] === p1X && p2P[1][i] === p1Y) {
            p2S += 1;
            reset();
        }
        //Player 1 into self
        if(p1P[0][i] === p1X && p1P[1][i] === p1Y) {
            p2S += 1;
            reset();
        }
        //Player 2 into self
        if(p2P[0][i] === p2X && p2P[1][i] === p2Y) {
            p1S += 1;
            reset();
        }
    }
    //Player 1 into wall
    if(p1X >= dimX - 4 || p1X <= 4 || p1Y >= dimY - 4 || p1Y <= 4) {
        p2S += 1;
        reset();
    }
    //Player 2 into wall
    if(p2X >= dimX - 4 || p2X <= 4 || p2Y >= dimY - 4 || p2Y <= 4) {
        p1S += 1;
        reset();
    }
}

//Updating the canvas
var update = function() {
    paintPlayers();
    colDetection();
}

var keyDown = function(e) {
    //A-key
    if(e.keyCode === 65) {
        if(p1VX === 1 && p1VY === 0) {
            p1VX = 0;
            p1VY = -1;
        }
        else if(p1VX === 0 && p1VY === 1) {
            p1VX = 1;
            p1VY = 0;
        }
        else if(p1VX === -1 && p1VY === 0) {
            p1VX = 0;
            p1VY = 1;
        }
        else if(p1VX === 0 && p1VY === -1) {
            p1VX = -1;
            p1VY = 0;
        }
    }
    //D-key
    else if(e.keyCode === 68) {
        if(p1VX === 1 && p1VY === 0) {
            p1VX = 0;
            p1VY = 1;
        }
        else if(p1VX === 0 && p1VY === 1) {
            p1VX = -1;
            p1VY = 0;
        }
        else if(p1VX === -1 && p1VY === 0) {
            p1VX = 0;
            p1VY = -1;
        }
        else if(p1VX === 0 && p1VY === -1) {
            p1VX = 1;
            p1VY = 0;
        }
    }
    //Left arrow-key
    if(e.keyCode === 37) {
        if(p2VX === 1 && p2VY === 0) {
            p2VX = 0;
            p2VY = -1;
        }
        else if(p2VX === 0 && p2VY === 1) {
            p2VX = 1;
            p2VY = 0;
        }
        else if(p2VX === -1 && p2VY === 0) {
            p2VX = 0;
            p2VY = 1;
        }
        else if(p2VX === 0 && p2VY === -1) {
            p2VX = -1;
            p2VY = 0;
        }
    }
    //Right arrow-key
    else if(e.keyCode === 39) {
        if(p2VX === 1 && p2VY === 0) {
            p2VX = 0;
            p2VY = 1;
        }
        else if(p2VX === 0 && p2VY === 1) {
            p2VX = -1;
            p2VY = 0;
        }
        else if(p2VX === -1 && p2VY === 0) {
            p2VX = 0;
            p2VY = -1;
        }
        else if(p2VX === 0 && p2VY === -1) {
            p2VX = 1;
            p2VY = 0;
        }
    }
}

//Resetting everything for first play
reset();

//Calls the update function sixty times per second
window.setInterval(update, 50 / 3);
