let flapPower = -5;
let gravity = 0.25;
let obstacleSpeed = -3;
let birdSize = 40;
let bird = null;
let obstacle = [];
let obstacleWidth = 75;
let passingHeight = 2.75*birdSize; 
let gameOver = null;
let obstacleDistance = 3.8 * obstacleWidth;
let img;
let bg;
let pipel;
let pipeu;

function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

function setup () {
    createCanvas(1000, 600);
    background(color(135,206,250));
    img = loadImage("assets/images/bird.png");  // Load the image
    bg = loadImage("assets/images/bg.png");
    pipel = loadImage("assets/images/pipe-l.png");
    pipeu = loadImage("assets/images/pipe-u.png");
    bird = new Bird();
    obstacle = [];
    obstacle.push(new Obstacle(400,randomInteger(75, height - passingHeight-75)));
    obstacle.push(new Obstacle(400 + obstacleDistance,randomInteger(75, height - passingHeight-75)));
    obstacle.push(new Obstacle(400 + 2* obstacleDistance,randomInteger(75, height - passingHeight-75)));
    obstacle.push(new Obstacle(400 + 3* obstacleDistance,randomInteger(75, height - passingHeight-75)));
    obstacle.push(new Obstacle(400 + 4* obstacleDistance,randomInteger(75, height - passingHeight-75)));
    obstacle.push(new Obstacle(400 + 5* obstacleDistance,randomInteger(75, height - passingHeight-75)));
    gameOver = false;
    
}

function draw () {
    if (!gameOver) {
        // background(color(135,206,250));
        background(bg);
        bird.update();
        bird.show();
        obstacle.forEach(o => {
            o.update();
            o.show();
        });
        obstacle.forEach(o =>    {
            if( (bird.top < o.upperHeight || bird.bottom > o.lowerHeight) && (bird.right > o.left && bird.left < o.right) ){
                gameOver = true;
            }
        });
        if(obstacle[0].xPosition <= -obstacleWidth){
            obstacle.shift();
            obstacle.push( new Obstacle(obstacle[obstacle.length-1].xPosition + obstacleDistance, randomInteger(75, height - passingHeight-75)) );
        }
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
        this.top = this.y - birdSize/2;
        this.bottom = this.y + birdSize/2;
        this.left = this.x - birdSize/2;
        this.right = this.x + birdSize/2;
    }
    flap() {
        this.yVelocity = flapPower;
    }
    show() {
        // rect(this.left, this.top, birdSize, birdSize); 
        image(img, this.left, this.top, birdSize, birdSize);
    }
    update() {
        this.y += this.yVelocity;
        this.yVelocity += gravity;
        this.top = this.y - birdSize/2;
        this.bottom = this.y + birdSize/2;
        if (height <= ( this.y+ (birdSize/2) ) ) gameOver = true;
    }
}

class Obstacle {
    constructor(xPosition, height) {
        this.xPosition = xPosition;
        this.height = height;
        this.upperHeight = height;
        this.lowerHeight = this.height + passingHeight;
        this.left = this.xPosition;
        this.right = this.xPosition + obstacleWidth;
    }
    show() {
        fill(5,135,56);
        // rect(this.left, this.upperHeight, obstacleWidth, passingHeight-height);
        image(pipeu,this.left, this.upperHeight, obstacleWidth, passingHeight-height );
        // rect(this.left, this.lowerHeight, obstacleWidth, height - passingHeight);
        image(pipel,this.left, this.lowerHeight, obstacleWidth, height - passingHeight );
    }
    update()    {
        this.xPosition  += obstacleSpeed;
        this.left = this.xPosition;
        this.right = this.xPosition + obstacleWidth;
    } 
 }