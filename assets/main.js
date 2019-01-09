let flapPower = -5;
let gravity = 0.25;
let obstacleSpeed = -3;
let birdSize = 50;
let bird = null;
let obstacle = [];
let obstacleWidth = 75;
let passingHeight = 3*birdSize; 
let gameOver = null;
let obstacleDistance = 3.8 * obstacleWidth;

function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}



function setup () {
    createCanvas(1000, 600);
    background(color(135,206,250));
    bird = new Bird();
    obstacle = [];
    obstacle.push(new Obstacle(400,75));
    obstacle.push(new Obstacle(400 + obstacleDistance,height - passingHeight-75));
    obstacle.push(new Obstacle(400 + 2* obstacleDistance,randomInteger(75, height - passingHeight-75)));
    gameOver = false;
    
}

function draw () {
    if (!gameOver) {
        background(color(135,206,250));
        bird.update();
        bird.show();
        obstacle.forEach(o => {
            o.update();
            o.show();
        });

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