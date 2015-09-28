//Saving the canvases and their content to variables
var bg = document.getElementById("bg"),
    fg = document.getElementById("fg"),
    ffg = document.getElementById("ffg"),
    off_canv1 = document.createElement("CANVAS"),
    off_canv2 = document.createElement("CANVAS");

var bg_ctx = bg.getContext("2d"),
    fg_ctx = fg.getContext("2d"),
    ffg_ctx = ffg.getContext("2d"),
    off_ctx1 = off_canv1.getContext("2d"),
    off_ctx2 = off_canv2.getContext("2d");

//Saving the canvases to a list
var canvases = document.getElementsByClassName("canv");

//Setting the canvas dimensions to the maximum available size within the window
bg_ctx.canvas.width = window.innerWidth;
bg_ctx.canvas.height = window.innerHeight;

//Setting the height and width of the canvas to variables
var dimX = bg_ctx.canvas.width,
    dimY = bg_ctx.canvas.height;

//Resizing secondary canvases to the size of the primary canvas
var init = function (ctx) {
    ctx.canvas.width = dimX;
    ctx.canvas.height = dimY;
}

//Setting up all the non-player relevant variables
var players = 2;
var speed = 1;
var gameStatus = "false";

//Adding a few default controls and their corresponding keycodes
var defaultControls = ["A", "S", "J", "K", "V", "B", "U", "I", "R", "T"],
    defaultKeyCodes = [[65, 74, 86, 85, 82], [83, 75, 66, 73, 84]];

//Setting the keycodes for starting the game (space), and pausing the game (escape)
var keyCodeStart = 32,
    keyCodeMenu = 27;

//Setting the initial timers for when holes appear in the path, they start at a negative value to allow for no pathing at the start
var holeTimer = -100,
    noHoleTimer = 75;

var colors = function (player) {
    //Returns random hex color
    var randColor = function () {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }

    //Saving the color element to variables, and setting its default color to a random one
    window["colorPicker" + player] = document.getElementById("colorPicker" + player);
    window["colorPicker" + player].value = randColor();

    //When the color picker has been changed, save it to the color variable
    window["colorPicker" + player].addEventListener("change", function () {
        window["p" + player + "C"] = event.srcElement.value;
    });

    //Adding colors for the players
    window["p" + player + "C"] = document.getElementById("colorPicker" + player).value;
}

var names = function (player) {
    //Resetting all names
    window["name" + player] = "";
    window["name" + player + "Added"] = false;

    //When the names have been changed, save them to the name variables, and show that they have been set
    document.getElementById("name" + player).addEventListener("change", function () {
        window["name" + player] = event.srcElement.value;
        window["name" + player + "Added"] = true;
    });
}

//All player-relevant variables
var vars = function (player) {
    //Adding starting dimensions for the players
    window["p" + player + "X"] = 0;
    window["p" + player + "Y"] = 0;

    //Adding arrays for storing line areas
    window["p" + player + "P"] = [[], []];

    //Adding speeds for the players
    window["p" + player + "VX"] = speed;
    window["p" + player + "VY"] = speed;

    //Adding default keycodes
    window["p" + player + "LeftKey"] = defaultKeyCodes[0][player - 1];
    window["p" + player + "RightKey"] = defaultKeyCodes[1][player - 1];
}

var setBaseSpeed = function () {
    document.getElementById("speed").addEventListener("change", function () {
        speed = event.srcElement.value;
    });
}

//Setting random speeds for the players
var setRandSpeed = function (player) {
    //Returns a random integer in a specific range
    var randNum = function (max, min) {
        return (Math.floor(Math.random() * (max - min + 1)) + min);
    }

    //Gets a random integer between -2 and 2, and saves it in n
    var n = randNum(-2, 2);

    //Updates the players speeds depending on the value of n
    if (n === -1 || n === 1) {
        window[player + "VX"] = 0;
        window[player + "VY"] = n * speed;
    } else if (n === 0 || n === 2) {
        window[player + "VY"] = (n - 1) * speed;
        window[player + "VY"] = 0;
    }
}

var keys = function () {
    //Calling keyDown when a key has been pressed
    document.getElementById("main").addEventListener("keydown", function () {
        keyDown(event);
    });

    //Saving all the elements with the class 'keys' in an array
    keyList = document.getElementsByClassName("keys");

    //Setting the initial text of those elements to the keys in the default controls array
    for (var i = 0; i < keyList.length; i += 1) {
        document.getElementById(keyList[i].id).innerHTML = defaultControls[i];
    }
}

//Configuring the menu
var confInit = function (e) {
    //Saving the menu element to a variable
    var conf = document.getElementById("conf");

    //Removing all children of the menu element
    while (conf.firstChild) {
        conf.removeChild(conf.firstChild);
    }

    //Saving the amount of players to a variable
    if (parseInt(e) > 0) {
        players = parseInt(e);
    }

    //Creating HTML with options and information based on the amount of players
    for (var i = 1; i < players + 1; i += 1) {
        //Creating the row which contains all the information about a player
        var row = document.createElement("DIV");
        row.setAttribute("class", "row");

        //Displaying the name of the player
        var para = document.createElement("P");
        var bold = document.createElement("B");
        var para1Text = document.createTextNode("Player " + i + ":");
        bold.appendChild(para1Text);
        para.appendChild(bold);

        //Guidance text
        var paraName = document.createElement("P");
        var paraNameText = document.createTextNode("Name = ");
        paraName.appendChild(paraNameText);

        //Displaying an editable text box with the players name
        var name = document.createElement("INPUT");
        name.setAttribute("type", "text");
        name.setAttribute("id", "name" + i);
        name.setAttribute("value", "Player " + i);

        //Guidance text
        var paraColor = document.createElement("P");
        var paraColorText = document.createTextNode("Color = ");
        paraColor.appendChild(paraColorText);

        //Displaying an editable color
        var color = document.createElement("INPUT");
        color.setAttribute("type", "color");
        color.setAttribute("id", "colorPicker" + i);

        //Guidance text
        var leftPara = document.createElement("P");
        var leftParaText = document.createTextNode("Left key = ");
        leftPara.appendChild(leftParaText);

        //Displaying the key that's used to make the player turn left, and can be clicked to allow you to change the value with a key press
        var leftDiv = document.createElement("DIV");
        leftDiv.setAttribute("id", "p" + i + "LeftKey");
        leftDiv.setAttribute("class", "keys");
        leftDiv.setAttribute("tabindex", "0");
        leftDiv.setAttribute("onKeyDown", "keyHandler(event, 'p" + i + "', 'Left')");

        //Guidance text
        var rightPara = document.createElement("P");
        var rightParaText = document.createTextNode("Right key = ");
        rightPara.appendChild(rightParaText);

        //Displaying the key that's used to make the player turn right, and can be clicked to allow you to change the value with a key press
        var rightDiv = document.createElement("DIV");
        rightDiv.setAttribute("id", "p" + i + "RightKey");
        rightDiv.setAttribute("class", "keys");
        rightDiv.setAttribute("tabindex", "0");
        rightDiv.setAttribute("onKeyDown", "keyHandler(event, 'p" + i + "', 'Right')");

        //Adding everything to the row element
        row.appendChild(para);
        row.appendChild(paraName);
        row.appendChild(name);
        row.appendChild(paraColor);
        row.appendChild(color);
        row.appendChild(leftPara);
        row.appendChild(leftDiv);
        row.appendChild(rightPara);
        row.appendChild(rightDiv);

        //Adding the row element to the menu
        conf.appendChild(row);

        //Calling all the player initialization functions
        colors(i);
        names(i);
        setBaseSpeed();
        vars(i);
        setRandSpeed(i);
    }
    //Calling keys to enable key input and to show the default controls in the key elements.
    keys();
}

//Setting up the menu
confInit();

//Calling the menu configuration function when the amount of players have been changed.
document.getElementById("players").addEventListener("change", function () {
    confInit(event.srcElement.value);
});

//Handling the key elements. Saves the key pressed, and then displays it.
var keyHandler = function (e, player, direction) {
    window[player + direction + "Key"] = event.keyCode;
    document.getElementById(player + direction + "Key").innerHTML = String.fromCharCode(event.keyCode);
}

//Drawing the little widget in the upper-left corner that shows the players and their color
var drawPlayerWidget = function (ctx) {
    var allNamesAdded = true;

    //Checking if all names have been saved to variables
    for (var i = 1; i < players + 1; i += 1) {
        if (window["name" + i + "Added"] === false) {
            allNamesAdded = false;
        }
    }

    //If they have, and the game has started, then draw the names.
    if (allNamesAdded && gameStatus) {
        //Drawing player widget
        ctx.strokeStyle = "#FFFFFF";
        for (var i = 1; i < players + 1; i += 1) {
            ctx.strokeText(window["name" + i] + ":", 20, 10 + 20 * i);
        }
    }
    //Else, save the names to variables
    else {
        for (var i = 1; i < players + 1; i += 1) {
            window["name" + i] = "Player " + i;
            window["name" + i + "Added"] = true;
        }

        //And run the function again
        drawPlayerWidget(ffg_ctx);
    }

    //Drawing the colored lines to the right of the player names
    for (var i = 1; i < players + 1; i += 1) {
        ctx.beginPath();

        ctx.lineWidth = 10;
        ctx.lineCap = "round";

        ctx.moveTo(75, 7 + 20 * i);
        ctx.lineTo(110, 7 + 20 * i);

        ctx.strokeStyle = window["p" + i + "C"];
        ctx.stroke();

        ctx.closePath();
    }
}

//Drawing the players
var paintPlayers = function (ctx) {
    function uniq(a) {
        var seen = {};
        return a.filter(function(item) {
            return seen.hasOwnProperty(item) ? false : (seen[item] = true);
        });
    }

    for (var i = 1; i < players + 1; i += 1) {
        //If the hole timer hasn't reached zero
        if (holeTimer > 0) {
            //Drawing player
            ctx.beginPath();

            ctx.strokeStyle = window["p" + i + "C"];
            ctx.arc(window["p" + i + "X"], window["p" + i + "Y"], 5, 0, Math.PI * 2);
            ctx.stroke();

            ctx.closePath();

            //Adding player coords to array
            window["p" + i + "P"][0].push(window["p" + i + "X"]);
            window["p" + i + "P"][1].push(window["p" + i + "Y"]);

            //Moving player
            window["p" + i + "X"] += window["p" + i + "VX"];
            window["p" + i + "Y"] += window["p" + i + "VY"];

            //Decrease the hole timer with 1 (since this gets called as many times as there is players, the total will be 1)
            holeTimer -= 1 / players;
        }
        //If the hole timer has reached zero,
        else {
            //But the no hole timer hasn't
            if (noHoleTimer > 0) {
                //Moving player without drawing the player or updating the arrays
                window["p" + i + "X"] += window["p" + i + "VX"];
                window["p" + i + "Y"] += window["p" + i + "VY"];

                //And decrease the no hole timer by 1
                noHoleTimer -= 1 / players;
            }
            //If both timers have reached zero, then reset them and call the function again
            else {
                holeTimer = 350;
                noHoleTimer = 75;

                paintPlayers(ctx);
            }
        }
    }
}

//Drawing the yellow circle on the players position aswell as their labels
var drawPlayerCircle = function (ctx) {
    for (var i = 1; i < players + 1; i += 1) {
        //Drawing the player circle
        ctx.beginPath();

        ctx.fillStyle = "yellow";
        ctx.arc(window["p" + i + "X"], window["p" + i + "Y"], 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.closePath();

        //Drawing the player labels
        ctx.beginPath();

        ctx.fillStyle = "#FFFFFF";
        ctx.lineWidth = 1;
        ctx.fillText(window["name" + i], window["p" + i + "X"] - ctx.measureText(window["name" + i]).width / 2, window["p" + i + "Y"] - 10);
        ctx.fill();

        ctx.closePath();
    }
}

var reset = function () {
    //Returns random X and Y-values in a range
    var randPos = function (axis) {
        return (Math.floor(Math.random() * ((axis - 50) - 50 + 1) + 50));
    }

    //Clearing up from last game
    bg_ctx.clearRect(0, 0, dimX, dimY);
    off_ctx1.clearRect(0, 0, dimX, dimY);

    for (var i = 1; i < players + 1; i += 1) {
        //Adding starting dimensions for the players
        window["p" + i + "X"] = randPos(dimX);
        window["p" + i + "Y"] = randPos(dimY);

        //Adding random speeds
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
            finished();
        }
        console.log(p1P);

        for (var y = 1; y < players + 1; y += 1) {
            for (var i = 0; i < window["p" + y + "P"][0].length; i += 1) {
                //Player with self or other player
                if (window["p" + x + "P"][0][i] === window["p" + y + "X"] && window["p" + x + "P"][1][i] === window["p" + y + "Y"]) {
                    finished();
                }
            }
        }
    }
}

//Updating the canvas
var update = function () {
    //Painting the players
    paintPlayers(off_ctx1);
    bg_ctx.drawImage(off_canv1, 0, 0);

    //Clearing the circles and labels
    fg_ctx.clearRect(0, 0, dimX, dimY);
    off_ctx2.clearRect(0, 0, dimX, dimY);

    //Drawing new circles and labels
    drawPlayerCircle(off_ctx2);
    fg_ctx.drawImage(off_canv2, 0, 0);

    //Checking for collisions
    var t0 = performance.now();
    colDetection();
    var t1 = performance.now()

    console.log(t1 - t0);

    //Using requestAnimationFrame for much smoother gameplay
    mainLoop = requestAnimationFrame(update);
}

var keyDown = function (e) {
    //Start the game if the start button is pressed and the game isn't started already
    if (e.keyCode === keyCodeStart && gameStatus === "false") {
        start();
    }
    //Resume the game if the start button is pressed and the game is paused
    else if (e.keyCode === keyCodeStart && gameStatus === "menu") {
        resume();
    }
    //Start new game if current one was concluded
    else if (e.keyCode === keyCodeStart && gameStatus === "finished") {
        startOver();
    }

    //Pause the game if the menu button is pressed and the game is running
    if (e.keyCode === keyCodeMenu && (gameStatus === "true" || gameStatus === "finished")) {
        menu();
    }

    for (var i = 1; i < players + 1; i += 1) {
        if (e.keyCode === window["p" + i + "LeftKey"]) {
            if (window["p" + i + "VX"] === speed && window["p" + i + "VY"] === 0) {
                window["p" + i + "VX"] = 0;
                window["p" + i + "VY"] = -speed;
            } else if (window["p" + i + "VX"] === 0 && window["p" + i + "VY"] === speed) {
                window["p" + i + "VX"] = speed;
                window["p" + i + "VY"] = 0;
            } else if (window["p" + i + "VX"] === -speed && window["p" + i + "VY"] === 0) {
                window["p" + i + "VX"] = 0;
                window["p" + i + "VY"] = speed;
            } else if (window["p" + i + "VX"] === 0 && window["p" + i + "VY"] === -speed) {
                window["p" + i + "VX"] = -speed;
                window["p" + i + "VY"] = 0;
            }
        } else if (e.keyCode === window["p" + i + "RightKey"]) {
            if (window["p" + i + "VX"] === speed && window["p" + i + "VY"] === 0) {
                window["p" + i + "VX"] = 0;
                window["p" + i + "VY"] = speed;
            } else if (window["p" + i + "VX"] === 0 && window["p" + i + "VY"] === speed) {
                window["p" + i + "VX"] = -speed;
                window["p" + i + "VY"] = 0;
            } else if (window["p" + i + "VX"] === -speed && window["p" + i + "VY"] === 0) {
                window["p" + i + "VX"] = 0;
                window["p" + i + "VY"] = -speed;
            } else if (window["p" + i + "VX"] === 0 && window["p" + i + "VY"] === -speed) {
                window["p" + i + "VX"] = speed;
                window["p" + i + "VY"] = 0;
            }
        }
    }
}

//Runs when starting the game with the start button
var start = function () {
    gameStatus = "true";

    //Hiding the menu
    document.getElementById("menu").style.display = "none";

    //Showing all the canvases
    for (var i = 0; i < canvases.length; i += 1) {
        canvases[i].style.display = "block";
    }

    //Resizing secondary canvases to the size of the primary canvas
    init(fg_ctx);
    init(ffg_ctx);
    init(off_ctx1);
    init(off_ctx2);

    //Drawing the widget, resetting, and updating the canvas
    drawPlayerWidget(ffg_ctx);
    reset();
    update();
}

//Runs when the menu button is pressed and the game is running
var menu = function () {
    gameStatus = "menu";

    //Shows the menu
    document.getElementById("menu").style.display = "block";

    //Hides all the canvases
    for (var i = 0; i < canvases.length; i += 1) {
        canvases[i].style.display = "none";
    }

    //Pausing the main loop
    cancelAnimationFrame(mainLoop);
}

//Runs when the start button is pressed, the game is paused, and the game has already been started once
var resume = function () {
    gameStatus = "true";

    //Hiding the menu
    document.getElementById("menu").style.display = "none";

    //Showing all the canvases
    for (var i = 0; i < canvases.length; i += 1) {
        canvases[i].style.display = "block";
    }

    //Drawing the widget and updating the canvas
    drawPlayerWidget(ffg_ctx);
    update();
}

var finished = function () {
    gameStatus = "finished";
    for (var i = 1; i < players + 1; i += 1) {
        window["p" + i + "VX"] = 0;
        window["p" + i + "VY"] = 0;
    }

    cancelAnimationFrame(mainLoop);
}

var startOver = function () {
    gameStatus = "true";

    speed = 0.5;

    for (var i = 1; i < players + 1; i += 1) {
        vars(i);
    }

    reset();
    update();
}
