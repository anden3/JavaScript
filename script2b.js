var canv = document.getElementById("c");
var ctx = canv.getContext("2d");

//Defining and setting default offsets and speeds
var horzOff = 0;
var vertOff = 0;
var horzSpd = 1;
var vertSpd = 1;

//Defining 'currently moving' booleans
var movingRightNow = false;
var movingLeftNow = false;
var movingUpNow = false;
var movingDownNow = false;

var drawGuy = function(horzOffset, vertOffset) {
    ctx.clearRect(0, 0, canv.width, canv.height);
    ctx.save();

    ctx.beginPath();

    //Head
    ctx.arc(400 + horzOffset, 70 + vertOffset, 20, 0, 2 * Math.PI);

    //Body
    ctx.scale(1, 2);
    ctx.arc(400 + horzOffset, 72.5 + (vertOffset / 2), 20, 0, 2 * Math.PI);

    ctx.fillStyle = '#8ED6FF';
    ctx.fill();

    ctx.closePath();

    ctx.restore();

    ctx.beginPath();

    //Neck
    ctx.moveTo(400 + horzOffset, 90 + vertOffset);
    ctx.lineTo(400 + horzOffset, 105 + vertOffset);

    //Right arm
    ctx.moveTo(417.5 + horzOffset, 120 + vertOffset);
    ctx.lineTo(430 + horzOffset, 150 + vertOffset);

    //Left arm
    ctx.moveTo(382.5 + horzOffset, 120 + vertOffset);
    ctx.lineTo(370 + horzOffset, 150 + vertOffset);

    //Right leg
    ctx.moveTo(410 + horzOffset, 180 + vertOffset);
    ctx.lineTo(415 + horzOffset, 235 + vertOffset);

    //Left leg
    ctx.moveTo(390 + horzOffset, 180 + vertOffset);
    ctx.lineTo(385 + horzOffset, 235 + vertOffset);

    ctx.closePath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'black';
    ctx.stroke();
}

drawGuy(0, 0);

var speed = function() {
    //Saving values from form fields into variables
    horzSpd = document.getElementById("horzSpeed").value;
    vertSpd = document.getElementById("vertSpeed").value;
}

var left = function() {
    stopMotion();
    movingLeftNow = true;
    window.movingLeft = setInterval("leftMove()", 1000 / 60);
}

var leftMove = function() {
    if(horzOff > -370) {
        horzOff -= horzSpd;
        drawGuy(horzOff, vertOff);
    }
}

var right = function() {
    stopMotion();
    movingRightNow = true;
    window.movingRight = setInterval("rightMove()", 1000 / 60);

}

var rightMove = function() {
    if(horzOff < 370) {
        horzOff -= -horzSpd;
        drawGuy(horzOff, vertOff);
    }
}

var stopMotion = function() {
    //Stopping intervals depending on what one is active
    if(movingRightNow) {
        clearInterval(window.movingRight);
        movingRightNow = false;
    }

    else if(movingLeftNow) {
        clearInterval(window.movingLeft);
        movingLeftNow = false;
    }
    else if(movingUpNow) {
        clearInterval(window.movingUp);
        movingUpNow = false;
    }
    else if(movingDownNow) {
        clearInterval(window.movingDown);
        movingDownNow = false;
    }
}

var resetPos = function() {
    //Halting motion and resets guy to default position
    stopMotion();
    horzOff = 0;
    vertOff = 0;
    drawGuy(0, 0);
}

var up = function() {
    stopMotion();
    movingUpNow = true;
    window.movingUp = setInterval("upMove()", 1000 / 60);
}

var upMove = function() {
    if(vertOff > -50) {
        vertOff -= vertSpd;
        drawGuy(horzOff, vertOff);
    }
}

var down = function() {
    stopMotion();
    movingDownNow = true;
    window.movingDown = setInterval("downMove()", 1000 / 60);
}

var downMove = function() {
    if(vertOff < 265) {
        vertOff -= -vertSpd;
        drawGuy(horzOff, vertOff);
    }
}
