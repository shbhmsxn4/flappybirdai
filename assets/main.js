"use strict"

function gameStartup () {
    let canvas = document.getElementById("gameCanvas");
    let ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(50,50,50,0,2*Math.PI);
    ctx.stroke();
}

window.onload = gameStartup;