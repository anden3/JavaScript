//Saving the canvas and its content to variables
var bg = document.getElementById("bg"),
    fg = document.getElementById("fg"),
    ffg = document.getElementById("ffg");

var bg_ctx = bg.getContext("2d"),
    fg_ctx = fg.getContext("2d"),
    ffg_ctx = ffg.getContext("2d");

//Setting the height and width of the canvas to variables
var dimX = 0,
    dimY = 0;

//Adding event handlers for the keys
document.getElementById("main").addEventListener("keydown", function () {
    keyDown(event);
});

//Initializing all canvases
var init = function (ctx) {
    //Setting the canvas dimensions to the maximum available size within the window
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    //Setting the height and width of the canvas to variables
    dimX = ctx.canvas.width, dimY = ctx.canvas.height;
}

init(bg_ctx);
init(fg_ctx);
init(ffg_ctx);

//Adding score display
fg_ctx.strokeStyle = "#FFFFFF";
fg_ctx.strokeText("Player 1: ", 20, 30);
fg_ctx.strokeText("Player 2: ", 20, 50);

var i = 1;

//Returns random X and Y-values
var randPos = function (axis) {
    return (Math.floor(Math.random() * ((axis - 5) - 5 + 1) + 5));
}

var randNum = function (max, min) {
    return (Math.floor(Math.random() * (max - min + 1)) + min);
}

//Returns random hex color
var randColor = function () {
    return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

function unique(array){
  var seen = new Set;
  return array.filter(function(item){
    if (!seen.has(item)) {
      seen.add(item);
      return true;
    }
  });
}

//Adding starting dimensions for the players
var p1X = 0,
    p1Y = 0;
var p2X = 0,
    p2Y = 0;

//Adding arrays for storing line areas
var p1P = [[], []],
    p2P = [[], []];

//Adding speeds for the players
var p1VX = 1,
    p1VY = 1;
var p2VX = 1,
    p2VY = 1;

//Setting random speeds for the players
var setRandSpeed = function (player) {
    var n = randNum(-1, 2);
    if (n === -1 ||  n === 1) {
        window[player + "VX"] = 0;
        window[player + "VY"] = n;
    } else if (n === 0 ||  n === 2) {
        window[player + "VY"] = n - 1;
        window[player + "VY"] = 0;
    }
}

//Adding colors for the players
var p1C = "",
    p2C = "";

//Adding scores for the players
var p1S = 0,
    p2S = 0;

//Drawing the score
var drawScore = function (ctx) {
    ctx.strokeStyle = "#FFFFFF";
    ctx.strokeText(p1S, 62, 30);
    ctx.strokeText(p2S, 62, 50);
}

//Drawing the players
var paintPlayers = function (player, ctx) {
    //Drawing player
    ctx.beginPath();
    ctx.arc(window[player + "X"], window[player + "Y"], 5, 0, Math.PI * 2);

    //Setting the color to a random one
    ctx.strokeStyle = window[player + "C"];
    ctx.stroke();
    ctx.closePath();

    //Adding player coords to array
    window[player + "P"][0].push(window[player + "X"]);
    window[player + "P"][1].push(window[player + "Y"]);

    //console.log(window[player + "P"]);

    //Moving player
    window[player + "X"] += window[player + "VX"];
    window[player + "Y"] += window[player + "VY"];
}

//Drawing the yellow circle on the players position
var drawPlayerCircle = function (player, ctx) {
    //Setting color to yellow
    ctx.fillStyle = "yellow";

    //Drawing player circle
    ctx.beginPath();
    ctx.arc(window[player + "X"], window[player + "Y"], 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

var reset = function () {
    //Clearing up player paths from last game
    bg_ctx.clearRect(0, 0, dimX, dimY);

    //Clearing away the old scores
    fg_ctx.clearRect(62, 30, 30, 40);

    //Drawing the new score
    drawScore(fg_ctx);

    p1P = [[], []];
    p2P = [[], []];

    //Adding starting dimensions for the players
    p1X = randPos(dimX), p1Y = randPos(dimY);
    p2X = randPos(dimX), p2Y = randPos(dimY);

    //Set speeds to either -1, 0 or 1
    setRandSpeed("p1");
    setRandSpeed("p2");

    //Adding colors for the players
    p1C = randColor(), p2C = randColor();
}

//Checking for collisions
var colDetection = function () {
    unique(p1P[0]);
    unique(p1P[1]);
    unique(p2P[0]);
    unique(p2P[1]);

    for (var i = 0; i < p1P[0].length; i++) {
        //Player 2 into player 1
        if (p1P[0][i] === p2X && p1P[1][i] === p2Y) {
            console.log("1");
            p1S += 1;
            reset();
        }
        //Player 1 into player 2
        else if (p2P[0][i] === p1X && p2P[1][i] === p1Y) {
            console.log("2");
            p2S += 1;
            reset();
        }
        //Player 1 into self
        else if (p1P[0][i] === p1X && p1P[1][i] === p1Y) {
            console.log("3");
            p2S += 1;
            reset();
        }
        //Player 2 into self
        else if (p2P[0][i] === p2X && p2P[1][i] === p2Y) {
            console.log("4");
            p1S += 1;
            reset();
        }
    }
    //Player 1 into wall
    if (p1X > dimX || p1X < 0 || p1Y > dimY ||  p1Y < 0) {
            console.log("5");
        p2S += 1;
        reset();
    }
    //Player 2 into wall
    if (p2X > dimX || p2X < 0 || p2Y > dimY ||  p2Y < 0) {
            console.log("6");
        p1S += 1;
        reset();
    }
}

//Updating the canvas
var update = function () {
    paintPlayers("p1", bg_ctx);
    paintPlayers("p2", bg_ctx);

    //Clearing away the old player circles
    ffg_ctx.clearRect(0, 0, dimX, dimY);

    drawPlayerCircle("p1", ffg_ctx);
    drawPlayerCircle("p2", ffg_ctx);

    colDetection();

    //Using requestAnimationFrame instead of setInterval for much smoother updating
    requestAnimationFrame(update);
}

//Checking for keys being pressed
var keyDown = function (e) {
    //A-key
    if (e.keyCode === 65) {
        if (p1VX === 1 && p1VY === 0) {
            p1VX = 0;
            p1VY = -1;
        } else if (p1VX === 0 && p1VY === 1) {
            p1VX = 1;
            p1VY = 0;
        } else if (p1VX === -1 && p1VY === 0) {
            p1VX = 0;
            p1VY = 1;
        } else if (p1VX === 0 && p1VY === -1) {
            p1VX = -1;
            p1VY = 0;
        }
    }
    //D-key
    else if (e.keyCode === 68) {
        if (p1VX === 1 && p1VY === 0) {
            p1VX = 0;
            p1VY = 1;
        } else if (p1VX === 0 && p1VY === 1) {
            p1VX = -1;
            p1VY = 0;
        } else if (p1VX === -1 && p1VY === 0) {
            p1VX = 0;
            p1VY = -1;
        } else if (p1VX === 0 && p1VY === -1) {
            p1VX = 1;
            p1VY = 0;
        }
    }
    //Left arrow-key
    if (e.keyCode === 37) {
        if (p2VX === 1 && p2VY === 0) {
            p2VX = 0;
            p2VY = -1;
        } else if (p2VX === 0 && p2VY === 1) {
            p2VX = 1;
            p2VY = 0;
        } else if (p2VX === -1 && p2VY === 0) {
            p2VX = 0;
            p2VY = 1;
        } else if (p2VX === 0 && p2VY === -1) {
            p2VX = -1;
            p2VY = 0;
        }
    }
    //Right arrow-key
    else if (e.keyCode === 39) {
        if (p2VX === 1 && p2VY === 0) {
            p2VX = 0;
            p2VY = 1;
        } else if (p2VX === 0 && p2VY === 1) {
            p2VX = -1;
            p2VY = 0;
        } else if (p2VX === -1 && p2VY === 0) {
            p2VX = 0;
            p2VY = -1;
        } else if (p2VX === 0 && p2VY === -1) {
            p2VX = 1;
            p2VY = 0;
        }
    }
}

//Resetting everything for first play
reset();

//Starting the canvas updating
update();
