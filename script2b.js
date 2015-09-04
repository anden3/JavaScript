$(document).ready(function() {
    var canv = document.getElementById("c");
    var ctx = canv.getContext("2d");

    ctx.beginPath();
    ctx.arc(420, 70, 40, 0, 2 * Math.PI);

    ctx.moveTo(420, 110);
    ctx.lineTo(420, 160);
    ctx.stroke();
});

