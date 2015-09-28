//Saving the canvases and their content to variables
var bg = document.getElementById("bg"),
    fg = document.getElementById("fg"),
    ffg = document.getElementById("ffg");

var bg_ctx = bg.getContext("2d"),
    fg_ctx = fg.getContext("2d"),
    ffg_ctx = ffg.getContext("2d");


var canvases = document.getElementsByClassName("canv");

//Setting the canvas dimensions to the maximum available size within the window
bg_ctx.canvas.width = window.innerWidth;
bg_ctx.canvas.height = window.innerHeight;

//Setting the height and width of the canvas to variables
var dimX = bg_ctx.canvas.width,
    dimY = bg_ctx.canvas.height;

//Initializing secondary canvases
var init = function (ctx) {
    ctx.canvas.width = dimX;
    ctx.canvas.height = dimY;
}

init(fg_ctx);
init(ffg_ctx);

var mainLoop;
var players = 2;
var gameStarted = "false";

var defaultControls = ["A", "S", "J", "K", "V", "B", "U", "I", "R", "T"],
    defaultKeyCodes = [[65, 74, 86, 85, 82], [83, 75, 66, 73, 84]];

var keyCodeStart = 32,
    keyCodeMenu = 27;

var holeTimer = -100,
    noHoleTimer = 75;

var colors = function (player) {
    //Returns random hex color
    var randColor = function () {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }

    window["colorPicker" + player] = document.getElementById("colorPicker" + player);
    window["colorPicker" + player].value = randColor();

    window["colorPicker" + player].addEventListener("change", function () {
        window["p" + player + "C"] = event.srcElement.value;
    });

    //Adding colors for the players
    window["p" + player + "C"] = document.getElementById("colorPicker" + player).value;
}

var names = function (player) {
    window["name" + player] = "";
    window["name" + player + "Added"] = false;

    document.getElementById("name" + player).addEventListener("change", function () {
        window["name" + player] = event.srcElement.value;
        window["name" + player + "Added"] = true;
    });
}

var vars = function (player) {
    //Adding starting dimensions for the players
    window["p" + player + "X"] = 0;
    window["p" + player + "Y"] = 0;

    //Adding arrays for storing line areas
    window["p" + player + "P"] = [[], []];

    //Adding speeds for the players
    window["p" + player + "VX"] = 1;
    window["p" + player + "VY"] = 1;

    //Adding default keycodes
    window["p" + player + "LeftKey"] = defaultKeyCodes[0][player - 1];
    window["p" + player + "RightKey"] = defaultKeyCodes[1][player - 1];
}

//Setting random speeds for the players
var setRandSpeed = function (player) {
    var randNum = function (max, min) {
        return (Math.floor(Math.random() * (max - min + 1)) + min);
    }

    var n = randNum(-2, 2);

    if (n === -1 || n === 1) {
        window[player + "VX"] = 0;
        window[player + "VY"] = n;
    } else if (n === 0 || n === 2) {
        window[player + "VY"] = n - 1;
        window[player + "VY"] = 0;
    }
}

var keys = function () {
    //Adding event handlers for the keys
    document.getElementById("main").addEventListener("keydown", function () {
        keyDown(event);
    });

    keyList = document.getElementsByClassName("keys");

    for (var i = 0; i < keyList.length; i += 1) {
        document.getElementById(keyList[i].id).innerHTML = defaultControls[i];
    }
}

var confInit = function(e) {
    var conf = document.getElementById("conf");

    while (conf.firstChild) {
        conf.removeChild(conf.firstChild);
    }
    if (parseInt(e) > 0) {
        players = parseInt(e);
    }
    for (var i = 1; i < players + 1; i += 1) {
        var row = document.createElement("DIV");
        row.setAttribute("class", "row");

        var para = document.createElement("P");
        var bold = document.createElement("B");
        var para1Text = document.createTextNode("Player " + i + ":");
        bold.appendChild(para1Text);
        para.appendChild(bold);

        var paraName = document.createElement("P");
        var paraNameText = document.createTextNode("Name = ");
        paraName.appendChild(paraNameText);

        var name = document.createElement("INPUT");
        name.setAttribute("type", "text");
        name.setAttribute("id", "name" + i);
        name.setAttribute("value", "Player " + i);

        var paraColor = document.createElement("P");
        var paraColorText = document.createTextNode("Color = ");
        paraColor.appendChild(paraColorText);

        var color = document.createElement("INPUT");
        color.setAttribute("type", "color");
        color.setAttribute("id", "colorPicker" + i);

        var leftPara = document.createElement("P");
        var leftParaText = document.createTextNode("Left key = ");
        leftPara.appendChild(leftParaText);

        var leftDiv = document.createElement("DIV");
        leftDiv.setAttribute("id", "p" + i + "LeftKey");
        leftDiv.setAttribute("class", "keys");
        leftDiv.setAttribute("tabindex", "0");
        leftDiv.setAttribute("onKeyDown", "keyHandler(event, 'p" + i + "', 'Left')");

        var rightPara = document.createElement("P");
        var rightParaText = document.createTextNode("Right key = ");
        rightPara.appendChild(rightParaText);

        var rightDiv = document.createElement("DIV");
        rightDiv.setAttribute("id", "p" + i + "RightKey");
        rightDiv.setAttribute("class", "keys");
        rightDiv.setAttribute("tabindex", "0");
        rightDiv.setAttribute("onKeyDown", "keyHandler(event, 'p" + i + "', 'Right')");

        row.appendChild(para);
        row.appendChild(paraName);
        row.appendChild(name);
        row.appendChild(paraColor);
        row.appendChild(color);
        row.appendChild(leftPara);
        row.appendChild(leftDiv);
        row.appendChild(rightPara);
        row.appendChild(rightDiv);

        conf.appendChild(row);

        colors(i);
        names(i);
        vars(i);
        setRandSpeed(i);
    }

    keys();
}

confInit();

document.getElementById("players").addEventListener("change", function () {
    confInit(event.srcElement.value);
});

var keyHandler = function(e, player, direction) {
    window[player + direction + "Key"] = event.keyCode;
    document.getElementById(player + direction + "Key").innerHTML = String.fromCharCode(event.keyCode);
}

var drawPlayerWidget = function (ctx) {
    var allNamesAdded = true;

    for (var i = 1; i < players + 1; i += 1) {
        if (window["name" + i + "Added"] === false) {
            allNamesAdded = false;
        }
    }
    if(allNamesAdded && gameStarted) {
        //Drawing player widget
        ctx.strokeStyle = "#FFFFFF";
        for (var i = 1; i < players + 1; i += 1) {
            ctx.strokeText(window["name" + i] + ":", 20, 10 + 20 * i);
        }
    }
    else {
        for (var i = 1; i < players + 1; i += 1) {
            window["name" + i] = "Player " + i;
            window["name" + i + "Added"] = true;
        }

        drawPlayerWidget(ffg_ctx);
    }

    for (var i = 1; i < players + 1; i += 1) {
        ctx.beginPath();

        ctx.lineWidth = 10;

        ctx.moveTo(65, 7 + 20 * i);
        ctx.lineTo(100, 7 + 20 * i);

        ctx.strokeStyle = window["p" + i + "C"];
        ctx.stroke();

        ctx.closePath();
    }
}

var paintPlayers = function (ctx) {
    for (var i = 1; i < players + 1; i += 1) {
        if (holeTimer > 0) {
            //Drawing player
            ctx.beginPath();
            ctx.arc(window["p" + i + "X"], window["p" + i + "Y"], 5, 0, Math.PI * 2);

            ctx.strokeStyle = window["p" + i + "C"];
            ctx.stroke();
            ctx.closePath();

            //Adding player coords to array
            window["p" + i + "P"][0].push(window["p" + i + "X"]);
            window["p" + i + "P"][1].push(window["p" + i + "Y"]);

            //Moving player
            window["p" + i + "X"] += window["p" + i + "VX"];
            window["p" + i + "Y"] += window["p" + i + "VY"];

            holeTimer -= 1 / players;
        } else {
            if (noHoleTimer > 0) {
                //Moving player
                window["p" + i + "X"] += window["p" + i + "VX"];
                window["p" + i + "Y"] += window["p" + i + "VY"];

                noHoleTimer -= 1 / players;
            } else {
                holeTimer = 350;
                noHoleTimer = 75;

                paintPlayers(bg_ctx);
            }
        }
    }
}

//Drawing the yellow circle on the players position
var drawPlayerCircle = function (ctx) {
    for (var i = 1; i < players + 1; i += 1) {
        //Drawing player circle
        ctx.beginPath();

        //Setting color to yellow
        ctx.fillStyle = "yellow";
        ctx.arc(window["p" + i + "X"], window["p" + i + "Y"], 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.closePath();

        //Drawing player label
        ctx.beginPath();

        ctx.fillStyle = "#FFFFFF";
        ctx.lineWidth = 1;
        ctx.fillText(window["name" + i], window["p" + i + "X"] - ctx.measureText(window["name" + i]).width / 2, window["p" + i + "Y"] - 10);
        ctx.fill();

        ctx.closePath();
    }
}

var timesRan = 0;

var reset = function () {
    //Returns random X and Y-values
    var randPos = function (axis) {
        return (Math.floor(Math.random() * ((axis - 50) - 50 + 1) + 50));
    }

    timesRan += 1;
    console.log(timesRan);

    //Clearing up from last game
    bg_ctx.clearRect(0, 0, dimX, dimY);

    for (var i = 1; i < players + 1; i += 1) {
        //Adding starting dimensions for the players
        window["p" + i + "X"] = randPos(dimX);
        window["p" + i + "Y"] = randPos(dimY);

        setRandSpeed("p" + i);

        //Adding arrays for storing line areas
        window["p" + i + "P"] = [[window["p" + i + "X"]], [window["p" + i + "Y"]]];
    }
}
//Checking for collisions
var colDetection = function () {
    for (var x = 1; x < players + 1; x += 1) {
        //Player with wall
        if (window["p" + x + "X"] >= dimX - 4 || window["p" + x + "X"] <= 4 || window["p" + x + "Y"] >= dimY - 4 || window["p" + x + "Y"] <= 4) {
            reset();
        }

        for (var y = 1; y < players + 1; y += 1) {
            for (var i = 0; i < window["p" + y + "P"][0].length; i += 1) {
                //Player with self or other player
                if (window["p" + x + "P"][0][i] === window["p" + y + "X"] && window["p" + x + "P"][1][i] === window["p" + y + "Y"]) {
                    ranColDetection = true;
                    reset();
                }
            }
        }
    }

}

//Updating the canvas
var update = function () {
    paintPlayers(bg_ctx);

    fg_ctx.clearRect(0, 0, dimX, dimY);
    drawPlayerCircle(fg_ctx);

    colDetection();

    mainLoop = requestAnimationFrame(update);
}

var keyDown = function (e) {
    if (e.keyCode === keyCodeStart && gameStarted === "false") {
        start();
    } else if (e.keyCode === keyCodeStart && gameStarted === "menu") {
        resume();
    }

    if (e.keyCode === keyCodeMenu && gameStarted === "true") {
        menu();
    }

    for (var i = 1; i < players + 1; i += 1) {
        if (e.keyCode === window["p" + i + "LeftKey"]) {
            if (window["p" + i + "VX"] === 1 && window["p" + i + "VY"] === 0) {
                window["p" + i + "VX"] = 0;
                window["p" + i + "VY"] = -1;
            }
            else if (window["p" + i + "VX"] === 0 && window["p" + i + "VY"] === 1) {
                window["p" + i + "VX"] = 1;
                window["p" + i + "VY"] = 0;
            }
            else if (window["p" + i + "VX"] === -1 && window["p" + i + "VY"] === 0) {
                window["p" + i + "VX"] = 0;
                window["p" + i + "VY"] = 1;
            }
            else if (window["p" + i + "VX"] === 0 && window["p" + i + "VY"] === -1) {
                window["p" + i + "VX"] = -1;
                window["p" + i + "VY"] = 0;
            }
        }
        else if (e.keyCode === window["p" + i + "RightKey"]) {
            if (window["p" + i + "VX"] === 1 && window["p" + i + "VY"] === 0) {
                window["p" + i + "VX"] = 0;
                window["p" + i + "VY"] = 1;
            }
            else if (window["p" + i + "VX"] === 0 && window["p" + i + "VY"] === 1) {
                window["p" + i + "VX"] = -1;
                window["p" + i + "VY"] = 0;
            }
            else if (window["p" + i + "VX"] === -1 && window["p" + i + "VY"] === 0) {
                window["p" + i + "VX"] = 0;
                window["p" + i + "VY"] = -1;
            }
            else if (window["p" + i + "VX"] === 0 && window["p" + i + "VY"] === -1) {
                window["p" + i + "VX"] = 1;
                window["p" + i + "VY"] = 0;
            }
        }
    }
}

var start = function () {
    gameStarted = "true";

    document.getElementById("menu").style.display = "none";

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

    for (var i = 0; i < canvases.length; i += 1) {
        canvases[i].style.display = "none";
    }

    cancelAnimationFrame(mainLoop);
}

var resume = function () {
    gameStarted = "true";

    document.getElementById("menu").style.display = "none";

    for (var i = 0; i < canvases.length; i += 1) {
        canvases[i].style.display = "block";
    }

    drawPlayerWidget(ffg_ctx);
    update();
}
