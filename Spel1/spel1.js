//Saving the canvases and their content to variables
var bg = document.getElementById("bg"),
    fg = document.getElementById("fg"),
    ffg = document.getElementById("ffg");

var bg_ctx = bg.getContext("2d"),
    fg_ctx = fg.getContext("2d"),
    ffg_ctx = ffg.getContext("2d");

var mainLoop;
var gameStarted = "false";

//Setting the canvas dimensions to the maximum available size within the window
bg_ctx.canvas.width = window.innerWidth;
bg_ctx.canvas.height = window.innerHeight;

//Setting the height and width of the canvas to variables
var dimX = bg_ctx.canvas.width,
    dimY = bg_ctx.canvas.height;

//Returns random hex color
var randColor = function () {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

//Adding event handlers for the keys
document.getElementById("main").addEventListener("keydown", function () {
    keyDown(event);
});

colorPicker1 = document.getElementById("colorPicker1");
colorPicker2 = document.getElementById("colorPicker2");

colorPicker1.value = randColor();
colorPicker2.value = randColor();

colorPicker1.addEventListener("change", function () {
    p1C = event.srcElement.value;
});
colorPicker2.addEventListener("change", function () {
    p2C = event.srcElement.value;
});

document.getElementById("name1").addEventListener("change", function () {
    firstName = event.srcElement.value;
    firstNameAdded = true;
});
document.getElementById("name2").addEventListener("change", function () {
    secondName = event.srcElement.value;
    secondNameAdded = true;
});

document.getElementById("p1LeftKey").innerHTML = "A";
document.getElementById("p1RightKey").innerHTML = "D";
document.getElementById("p2LeftKey").innerHTML = "J";
document.getElementById("p2RightKey").innerHTML = "L";

var keyHandler = function(e, player, direction) {
    window[player + direction + "Key"] = event.keyCode;
    document.getElementById(player + direction + "Key").innerHTML = String.fromCharCode(event.keyCode);
}

//Initializing secondary canvases
var init = function (ctx) {
    ctx.canvas.width = dimX;
    ctx.canvas.height = dimY;
}

init(fg_ctx);
init(ffg_ctx);

var firstNameAdded = false;
var secondNameAdded = false;

var firstName = "";
var secondName = "";

var drawPlayerWidget = function (ctx) {
    if(firstNameAdded && secondNameAdded && gameStarted) {
        //Drawing player widget
        ctx.strokeStyle = "#FFFFFF";
        ctx.strokeText(firstName + ":", 20, 30);
        ctx.strokeText(secondName + ":", 20, 50);
    }
    else {
        firstName = "Player 1";
        secondName = "Player 2";

        firstNameAdded = true;
        secondNameAdded = true;

        drawPlayerWidget(ffg_ctx);
    }

    ctx.beginPath();

    ctx.lineWidth = 10;

    ctx.moveTo(65, 27);
    ctx.lineTo(100, 27);

    ctx.strokeStyle = p1C;
    ctx.stroke();

    ctx.closePath();

    ctx.beginPath();

    ctx.lineWidth = 10;

    ctx.moveTo(65, 47);
    ctx.lineTo(100, 47);

    ctx.strokeStyle = p2C;
    ctx.stroke();

    ctx.closePath();
}

//Returns random X and Y-values
var randPos = function (axis) {
    return (Math.floor(Math.random() * ((axis - 50) - 50 + 1) + 50));
}

var randNum = function (max, min) {
    return (Math.floor(Math.random() * (max - min + 1)) + min);
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

var p1LeftKey = 65,
    p1RightKey = 68;
var p2LeftKey = 74,
    p2RightKey = 76;

var holeTimer = -100,
    noHoleTimer = 75;

//Setting random speeds for the players
var setRandSpeed = function (player) {
    var n = randNum(-2, 2);
    if (n === -1 || n === 1) {
        window[player + "VX"] = 0;
        window[player + "VY"] = n;
    } else if (n === 0 || n === 2) {
        window[player + "VY"] = n - 1;
        window[player + "VY"] = 0;
    }
}

//Adding colors for the players
var p1C = document.getElementById("colorPicker1").value,
    p2C = document.getElementById("colorPicker2").value;

var paintPlayers = function (ctx) {
    if (holeTimer > 0) {
        //Drawing player 1
        ctx.beginPath();
        ctx.arc(p1X, p1Y, 5, 0, Math.PI * 2);

        ctx.strokeStyle = p1C;
        ctx.stroke();
        ctx.closePath();

        //Drawing player 2
        ctx.beginPath();
        ctx.arc(p2X, p2Y, 5, 0, Math.PI * 2);

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

        holeTimer -= 1;
    } else {
        if (noHoleTimer > 0) {
            //Moving player 1
            p1X += p1VX;
            p1Y += p1VY;

            //Moving player 2
            p2X += p2VX;
            p2Y += p2VY;

            noHoleTimer -= 1;
        } else {
            holeTimer = 350;
            noHoleTimer = 75;

            paintPlayers(bg_ctx);
        }
    }
}

//Drawing the yellow circle on the players position
var drawPlayerCircle = function (ctx) {
    //Setting color to yellow
    ctx.fillStyle = "yellow";

    //Drawing player circle
    ctx.beginPath();

    ctx.arc(p1X, p1Y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.lineWidth = 1;
    ctx.fillText(firstName, p1X - ctx.measureText(firstName).width / 2, p1Y - 10);
    ctx.fill();

    ctx.closePath();

    ctx.beginPath();

    ctx.arc(p2X, p2Y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(secondName, p2X - ctx.measureText(secondName).width / 2, p2Y - 10);
    ctx.fill();

    ctx.closePath();
}

var reset = function () {
    //Clearing up from last game
    bg_ctx.clearRect(0, 0, dimX, dimY);

    //Adding starting dimensions for the players
    p1X = randPos(dimX), p1Y = randPos(dimY);
    p2X = randPos(dimX), p2Y = randPos(dimY);

    setRandSpeed("p1");
    setRandSpeed("p2");

    //Adding arrays for storing line areas
    p1P = [[p1X], [p1Y]], p2P = [[p2X], [p2Y]];
}

//Checking for collisions
var colDetection = function () {
    for (var i = 0; i < p1P[0].length; i++) {
        //Player 2 with player 1
        if (p1P[0][i] === p2X && p1P[1][i] === p2Y) {
            reset();
        }
        //Player 1 with player 2
        if (p2P[0][i] === p1X && p2P[1][i] === p1Y) {
            reset();
        }
        //Player 1 with self
        if (p1P[0][i] === p1X && p1P[1][i] === p1Y) {
            reset();
        }
        //Player 2 with self
        if (p2P[0][i] === p2X && p2P[1][i] === p2Y) {
            reset();
        }
    }
    //Player 1 with wall
    if (p1X >= dimX - 4 || p1X <= 4 || p1Y >= dimY - 4 || p1Y <= 4) {
        reset();
    }
    //Player 2 with wall
    if (p2X >= dimX - 4 || p2X <= 4 || p2Y >= dimY - 4 || p2Y <= 4) {
        reset();
    }
}

//Updating the canvas
var update = function (colReturn) {
    paintPlayers(bg_ctx);

    fg_ctx.clearRect(0, 0, dimX, dimY);
    drawPlayerCircle(fg_ctx);

    colDetection();

    mainLoop = requestAnimationFrame(update);
}

var keyDown = function (e) {
    if (e.keyCode === 32 && gameStarted === "false") {
        start();
    } else if (e.keyCode === 32 && gameStarted === "menu") {
        resume();
    }

    if (e.keyCode === 27 && gameStarted === "true") {
        menu();
    }

    if (e.keyCode === p1LeftKey) {
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
    } else if (e.keyCode === p1RightKey) {
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

    if (e.keyCode === p2LeftKey) {
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
    } else if (e.keyCode === p2RightKey) {
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

var start = function () {
    gameStarted = "true";

    document.getElementById("menu").style.display = "none";

    var canvases = document.getElementsByClassName("canv");
    for (var i = 0; i < canvases.length; i += 1) {
        canvases[i].style.display = "block";
    }

    drawPlayerWidget(ffg_ctx);
    reset();
    update();
}

var menu = function () {
    gameStarted = "menu";

    document.getElementById("menu").style.display = "block";

    var canvases = document.getElementsByClassName("canv");
    for (var i = 0; i < canvases.length; i += 1) {
        canvases[i].style.display = "none";
        //canvases[i].style.backgroundColor = "grey";
    }

    cancelAnimationFrame(mainLoop);
}

var resume = function () {
    gameStarted = "true";

    document.getElementById("menu").style.display = "none";

    var canvases = document.getElementsByClassName("canv");
    for (var i = 0; i < canvases.length; i += 1) {
        canvases[i].style.display = "block";
        //canvases[i].style.backgroundColor = "black";
    }

    update();
}
