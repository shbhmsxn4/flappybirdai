let flapPower = 5;
let gravity = -10;
let obstacleSpeed = -10;
let birdSize = 50;
let bird = null;
let obstacle = null;
let obstacleWidth = 75;
let passingHeight = 3*birdSize; 

function setup () {
    createCanvas(800, 600);
    background(color(135,206,250));
    bird = new Bird();
    obstacle = new Obstacle(400,200);
}

function draw () {
    bird.show();
    obstacle.show();
    // rect(400, 0, 75, 200);
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

class Obstacle {
    constructor(xPosition, height) {
        this.xPosition = xPosition;
        this.height = height;
    }
    show() {
        // translate(-50, 0);
        rect(this.xPosition, 0, obstacleWidth, this.height);
    }
    // update()    {
    //     // translate(30, 20);
    // }
}