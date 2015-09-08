$(document).ready(function() {
    var canv = document.getElementById("c");
    var ctx = canv.getContext("2d");

    ctx.save();

    ctx.beginPath();

    ctx.arc(420, 70, 40, 0, 2 * Math.PI);

    ctx.scale(1, 2);
    ctx.arc(420, 110, 40, 0, 2 * Math.PI);

    ctx.fillStyle = '#8ED6FF';
    ctx.fill();

    ctx.closePath();

    ctx.restore();

    ctx.beginPath();

    ctx.moveTo(420, 110);
    ctx.lineTo(420, 140);

    ctx.moveTo(455, 180);
    ctx.lineTo(480, 240);

    ctx.moveTo(385, 180);
    ctx.lineTo(360, 240);

    ctx.moveTo(440, 289);
    ctx.lineTo(450, 400);

    ctx.moveTo(400, 289);
    ctx.lineTo(390, 400);

    ctx.closePath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'black';
    ctx.stroke();
});
