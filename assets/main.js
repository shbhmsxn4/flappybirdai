let flapPower = 5;
let gravity = -10;
let obstacleSpeed = -10;
let birdSize = 50;
let bird = null;

function setup () {
    createCanvas(800, 600);
    background(color(135,206,250));
    bird = new Bird();
    
}

function draw () {
    bird.show();
}

class Bird {
    constructor() {
        this.x = 100;
        this.y = 300;
        this.xVelocity = 0;
        this.yVelocity = 0;
    }
    flap() {
        this.yVelocity = flapPower;
    }
    show() {
        ellipse(this.x, this.y, birdSize, birdSize);
    }
}