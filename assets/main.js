let flapPower = -5;
let gravity = 0.25;
let obstacleSpeed = -3;
let birdSize = 50;
let bird = null;
let obstacle = null;
let obstacleWidth = 75;
let passingHeight = 3*birdSize; 
let gameOver = null;

function setup () {
    createCanvas(800, 600);
    background(color(135,206,250));
    bird = new Bird();
    obstacle = new Obstacle(400,200);
    gameOver = false;
    
}

function draw () {
    if (!gameOver) {
        background(color(135,206,250));
        bird.update();
        obstacle.update();
        bird.show();
        obstacle.show();
    }
    else {
        if (keyIsPressed) {
            setup();
        }
    }
}

function keyPressed() {
    switch(keyCode) {
        case 32:
            bird.flap();
            break;
    }
    return false;
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
    update() {
        this.y += this.yVelocity;
        this.yVelocity += gravity;
        if (height <= ( this.y+ (birdSize/2) ) ) gameOver = true;
    }
}

class Obstacle {
    constructor(xPosition, height) {
        this.xPosition = xPosition;
        this.height = height;
    }
    show() {
        rect(this.xPosition, this.height, obstacleWidth, passingHeight-height);
        rect(this.xPosition, this.height+passingHeight, obstacleWidth, height - passingHeight);
    }
    update()    {
        this.xPosition  += obstacleSpeed;
    }
    
}