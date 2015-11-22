var map_canvas = document.getElementById("map");
var map_ctx = map_canvas.getContext("2d");

var mapHeight = 500;
var mapWidth = 500;

var scalingX = 10;
var scalingY = 10;

map_ctx.canvas.width = mapHeight * scalingX;
map_ctx.canvas.height = mapWidth * scalingY;

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
        arr.push(mapSplice[i].splice(0, 10));
    }

    return arr;
};

var fillMap = function () {
    window.seedValue = Math.random();
    noise.seed(seedValue);

    var regions = (mapWidth / 10) * (mapHeight / 10);

    for (var region = 0; region < regions; region++) {
        window["region_" + region] = [];
    }

    var regCount = 0;

    for (var regX = 0; regX < (mapWidth / 10); regX++) {
        regionMap.push([]);
        for (var regY = 0; regY < (mapHeight / 10); regY++) {
            regionMap[regX].push(regCount);
            regCount += 1;
        }
    }

    var mapIter = 0;

    for (var x = 0; x < mapWidth; x++) {
        map.push([]);
        for (var y = 0; y < mapHeight; y++) {
            map[x].push(Math.abs(noise.simplex2(x / 100, y / 100)));
        }
    }

    while (map.length >= 10) {
        var split1D = map.splice(0, 10);

        for (var y = 0; y < mapHeight / 10; y++) {
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
            map_ctx.fillStyle = float2color(region[x][y]);

            var cellWidth = Math.ceil(mapWidth * scalingX / regionMap.length / region.length);
            var cellHeight = Math.ceil(mapHeight * scalingY / regionMap[indexX].length / region[x].length);

            var xPos = Math.ceil(cellWidth * x);
            var yPos = Math.ceil(cellHeight * y);

            map_ctx.fillRect(xPos + xOff, yPos + yOff, cellWidth, cellHeight);
        }
    }
};

var updateMap = function () {
    map_ctx.clearRect(0, 0, mapHeight * scalingX, mapWidth * scalingY);

    var activeRegionsStartX = Math.floor(scrollOffsets()[0] / regionMap.length / 2);
    var activeRegionsEndX = Math.ceil(activeRegionsStartX + window.innerWidth / regionMap.length / 2);

    var activeRegionsStartY = Math.floor(scrollOffsets()[1] / regionMap[0].length / 2);
    var activeRegionsEndY = Math.ceil(activeRegionsStartY + window.innerHeight / regionMap[0].length / 2);

    for (var rX = activeRegionsStartX; rX < activeRegionsEndX; rX++) {
        for (var rY = activeRegionsStartY; rY < activeRegionsEndY; rY++) {
            drawRegion(window["region_" + regionMap[rX][rY]], rX, rY);
        }
    }
}

var eventListeners = function () {
    document.addEventListener("scroll", updateMap);
}

fillMap();
eventListeners();
