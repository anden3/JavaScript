var map_canvas = document.getElementById("map");
var map_ctx = map_canvas.getContext("2d");

var char_canvas = document.getElementById("char");
var char_ctx = char_canvas.getContext("2d");

var mapHeight = 500;
var mapWidth = 500;

var regionSizeX = 10;
var regionSizeY = 10;

var scalingX = 10;
var scalingY = 10;

var charX = 500;
var charY = 200;

var charWidth = 10;
var charHeight = 10;
var charStep = 10;

map_ctx.canvas.width = mapHeight * scalingX;
map_ctx.canvas.height = mapWidth * scalingY;

char_ctx.canvas.width = mapHeight * scalingX;
char_ctx.canvas.height = mapWidth * scalingY;

var map = [];
var regionMap = [];

var float2color = function (percentage) {
    var color_part_dec = 255 * percentage;
    var color_part_hex = Number(parseInt(color_part_dec, 10)).toString(16);

    if (color_part_hex.length < 2) {
        color_part_hex = "0" + color_part_hex;
    }

    return "#" + color_part_hex + color_part_hex + color_part_hex;
};

var scrollOffsets = function () {
    var doc = document.documentElement;
    var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

    return [left, top];
}

var spliceMap = function (mapSplice) {
    var arr = [];

    for (var i = 0; i < mapSplice.length; i++) {
        if (mapSplice[i].length === 0) {
            mapSplice.splice(i, 1);
        }
    }

    for (var i = 0; i < mapSplice.length; i++) {
        arr.push(mapSplice[i].splice(0, regionSizeY));
    }

    return arr;
};

var sumOctave = function (iterations, x, y, persistance, scale) {
    var maxAmp = 0;
    var amp = 1;
    var freq = scale;
    var currentNoise = 0;

    for (var i = 0; i < iterations; i++) {
        currentNoise += noise.simplex2(x * freq, y * freq);
        maxAmp += amp;
        amp *= persistance;
        freq *= 2;
    }

    currentNoise /= maxAmp;

    return currentNoise;
}

var normalize = function (arr, dim, high) {
    if (dim === 2) {
        var tempArray = [];

        for (var x = 0; x < arr.length; x++) {
            tempArray.push(Math.max.apply(Math, arr[x]));
        }

        var ratio = Math.max.apply(Math, tempArray) / high;

        for (var x = 0; x < arr.length; x++) {
            for (var y = 0; y < arr[x].length; y++) {
                arr[x][y] = Math.abs(arr[x][y] / ratio);
            }
        }
    }
    else if (dim === 1) {
        var ratio = Math.max.apply(Math, arr) / high;

        for (var x = 0; x < arr.length; x++) {
            arr[x] = Math.abs(arr[x] / ratio);
        }
    }

    return arr;
}

var fillMap = function () {
    window.seedValue = Math.random();
    noise.seed(seedValue);

    var regions = (mapWidth / regionSizeX) * (mapHeight / regionSizeY);

    for (var region = 0; region < regions; region++) {
        window["region_" + region] = [];
    }

    var regCount = 0;

    for (var regX = 0; regX < (mapWidth / regionSizeX); regX++) {
        regionMap.push([]);
        for (var regY = 0; regY < (mapHeight / regionSizeY); regY++) {
            regionMap[regX].push(regCount);
            regCount += 1;
        }
    }

    var mapIter = 0;
    var scale = 1;

    for (var x = 0; x < mapWidth; x++) {
        map.push([]);
        for (var y = 0; y < mapHeight; y++) {
            map[x].push(sumOctave(5, x, y, 0.8, 0.001));
        }
    }

    map = normalize(map, 2, 1);

    while (map.length >= regionSizeX) {
        var split1D = map.splice(0, regionSizeX);

        for (var y = 0; y < mapHeight / regionSizeY; y++) {
            window["region_" + regionMap[mapIter][y]] = spliceMap(split1D);
        }
        mapIter += 1;
    }

    updateMap();
};

var displayArray = function (arr) {
    for (var row = 0; row < arr.length; row++) {
        var arrRow = arr[row].join("\t");
        console.log(arrRow);
    }
};

var drawRegion = function (region, indexX, indexY) {
    var xOff = Math.ceil(mapWidth * scalingX / regionMap.length * indexX);
    var yOff = Math.ceil(mapHeight * scalingY / regionMap[indexX].length * indexY);

    for (var x = 0; x < region.length; x++) {
        for (var y = 0; y < region[x].length; y++) {
            //map_ctx.fillStyle = float2color(region[x][y]);

            var tileValue = Math.floor(region[x][y] * 100) / 100;

            if (tileValue < 0.11) {
                map_ctx.fillStyle = "#bb8e68";
            }
            else if (tileValue < 0.22) {
                map_ctx.fillStyle = "#aa7243";
            }
            else if (tileValue < 0.33) {
                map_ctx.fillStyle = "#885b35";
            }

            else if (tileValue < 0.44) {
                map_ctx.fillStyle = "#329932";
            }
            else if (tileValue < 0.55) {
                map_ctx.fillStyle = "#008000";
            }
            else if (tileValue < 0.66) {
                map_ctx.fillStyle = "#006600";
            }

            else if (tileValue < 0.77) {
                map_ctx.fillStyle = "#3232ff";
            }
            else if (tileValue < 0.88) {
                map_ctx.fillStyle = "#0000ff";
            }
            else if (tileValue < 1) {
                map_ctx.fillStyle = "#0000cc";
            }

            var cellWidth = Math.ceil(mapWidth * scalingX / regionMap.length / region.length);
            var cellHeight = Math.ceil(mapHeight * scalingY / regionMap[indexX].length / region[x].length);

            var xPos = Math.ceil(cellWidth * x);
            var yPos = Math.ceil(cellHeight * y);

            map_ctx.fillRect(xPos + xOff, yPos + yOff, cellWidth, cellHeight);
        }
    }
};

var updateMap = function () {
    map_ctx.clearRect(0, 0, mapWidth * scalingX, mapHeight * scalingY);

    var activeRegionsStartX = Math.floor(scrollOffsets()[0] / regionMap.length / 2);
    var activeRegionsEndX = Math.ceil(activeRegionsStartX + window.innerWidth / regionMap[0].length / 2);

    var activeRegionsStartY = Math.floor(scrollOffsets()[1] / regionMap[0].length / 2);
    var activeRegionsEndY = Math.ceil(activeRegionsStartY + window.innerHeight / regionMap.length / 2);

    if (window.innerWidth < mapWidth * scalingX) {
        for (var rX = activeRegionsStartX; rX < activeRegionsEndX; rX++) {
            for (var rY = activeRegionsStartY; rY < activeRegionsEndY; rY++) {
                drawRegion(window["region_" + regionMap[rX][rY]], rX, rY);
            }
        }
    }
    else {
        for (var rX = 0; rX < regionMap.length; rX++) {
            for (var rY = 0; rY < regionMap[0].length; rY++) {
                drawRegion(window["region_" + regionMap[rX][rY]], rX, rY);
            }
        }
    }
}

var drawChar = function (axis, amount) {
    char_ctx.clearRect(charX - (charWidth + charStep), charY - (charHeight + charStep), charX + (charWidth + charStep), charY + (charHeight + charStep));

    var regionX = Math.floor(charX / charStep / regionSizeX);
    var regionY = Math.floor(charY / charStep / regionSizeY);

    var activeRegion = regionMap[regionX][regionY];
    var tileValue = window["region_" + activeRegion][charX / charStep - regionX * regionSizeX][charY / charStep - regionY * regionSizeY];

    tileValue = Math.floor(tileValue * 100) / 100;

    if (tileValue >= 0.66 && typeof axis !== "undefined") {
        window["char" + axis.toUpperCase()] -= amount;
        console.log(["char" + axis.toUpperCase(), amount]);
    }
    else {
        if (charX - (window.innerWidth / 2 + scrollOffsets()[0]) >= charStep && scrollOffsets()[0] < (mapWidth * scalingX) - window.innerWidth) {
            window.scrollBy(charStep, 0);
        }
        else if (charX - (window.innerWidth / 2 + scrollOffsets()[0]) <= -charStep && scrollOffsets()[0] !== 0) {
            window.scrollBy(-charStep, 0);
        }
        else if (charY - (window.innerHeight / 2 + scrollOffsets()[1]) >= charStep && scrollOffsets()[1] < (mapHeight * scalingY) - window.innerHeight) {
            window.scrollBy(0, charStep);
        }
        else if (charY - (window.innerHeight / 2 + scrollOffsets()[1]) <= -charStep && scrollOffsets()[1] !== 0) {
            window.scrollBy(0, -charStep);
        }
    }

    char_ctx.fillStyle = "black";
    char_ctx.fillRect(charX - charWidth, charY - charHeight, charWidth, charHeight);
}

/*
var update = function () {
    drawChar();

    window.requestAnimationFrame(update);
}
*/

var keyPressed = function (e) {
    var key = e.keyCode;

    e.preventDefault();

    switch (key) {
        case 37:
            if (charX >= charStep * 2) {
                charX -= charStep;
                drawChar("x", -charStep);
            }
            break;
        case 38:
            if (charY >= charStep * 2) {
                charY -= charStep;
                drawChar("y", -charStep);
            }
            break;
        case 39:
            if (charX <= mapWidth * scalingX - charStep * 2) {
                charX += charStep;
                drawChar("x", charStep);
            }
            break;
        case 40:
            if (charY <= mapHeight * scalingY - charStep * 2) {
                charY += charStep;
                drawChar("y", charStep);
            }
            break;
    }
}

var eventListeners = function () {
    document.addEventListener("scroll", updateMap);

    document.addEventListener("keydown", keyPressed, event);
}

fillMap();
eventListeners();
drawChar();
//update();
