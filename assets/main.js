//GAME CONTROL VARAIBLES

let flapPower = -5;
let gravity = 0.25;
let obstacleSpeed = -3;
let birdSize = 40;
let obstacle = [];
let obstacleWidth = 75;
let passingHeight = 2.75*birdSize; 
let obstacleDistance = 3.8 * obstacleWidth;

//AI VARIABLES
let currentBirds = [];

//LOADING RESOURCES

let img;
let bg;
let pipel;
let pipeu;
let font;
let fontSize = 40;
let fontPath = "assets/fonts/theboldfont.ttf";

//TRASH VARIABLES

// let bird = null;
// let gameOver = null;
// let score = 0;
// let birdInPipe = false;
// let birdWasInPipe = false;


function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

function setup () {
    createCanvas(1000, 600);
    background(color(135,206,250));
    img = loadImage("assets/images/bird.png");  // Load the image
    // img = loadImage("assets/images/squarebird.png");
    bg = loadImage("assets/images/bg.png");
    pipel = loadImage("assets/images/pipe-l.png");
    pipeu = loadImage("assets/images/pipe-u.png");
    font = loadFont(fontPath);
    textFont(font);
    textSize(fontSize);
    textAlign(CENTER, CENTER);
    // bird = new Bird();
    setupBirds();
    birds = currentBirds;
    obstacle = [];
    obstacle.push(new Obstacle(400,randomInteger(75, height - passingHeight-75)));
    obstacle.push(new Obstacle(400 + obstacleDistance,randomInteger(75, height - passingHeight-75)));
    obstacle.push(new Obstacle(400 + 2* obstacleDistance,randomInteger(75, height - passingHeight-75)));
    obstacle.push(new Obstacle(400 + 3* obstacleDistance,randomInteger(75, height - passingHeight-75)));
    obstacle.push(new Obstacle(400 + 4* obstacleDistance,randomInteger(75, height - passingHeight-75)));
    obstacle.push(new Obstacle(400 + 5* obstacleDistance,randomInteger(75, height - passingHeight-75)));
    // gameOver = false;
    // score = 0;
    // birdInPipe = false;
    // birdWasInPipe = false;
}

function draw () {
    if (birds.length != 0) {
        // background(color(135,26,250));
        background(bg);
        birds.forEach(b => {
            b.update();
            b.show();
        });
        // bird.update();
        // bird.show();
        obstacle.forEach(o => {
            o.update();
            o.show();
        });
        fill(255);
        showScore();
        // birdInPipe = false;
        obstacle.forEach(o =>    {
            // if( (bird.top < o.upperHeight || bird.bottom > o.lowerHeight) && (bird.right > o.left && bird.left < o.right) ){
            //     gameOver = true;
            // }
            // if (bird.right > o.left && bird.left < o.right) {
            //     birdInPipe = true;
            // }
            birds.forEach(b => {
                if( (b.top < o.upperHeight || b.bottom > o.lowerHeight) && (b.right > o.left && b.left < o.right) ){
                    b.gameOver = true;
                }
                if (b.right > o.left && b.left < o.right) {
                    b.isInPipe = true;
                }
            });
        });
        // if (birdWasInPipe && !birdInPipe) {
        //     score++;
        //     birdWasInPipe = false;
        // }
        // else {
        //     birdWasInPipe = birdInPipe;
        // }
        birds.forEach(b => {
            if (b.wasInPipe && !b.isInPipe) {
                b.score++;
                b.wasInPipe = false;
            }
            else {
                b.wasInPipe = b.isInPipe;
                b.isInPipe = false;
            }
        });
        if(obstacle[0].xPosition <= -obstacleWidth){
            obstacle.shift();
            obstacle.push( new Obstacle(obstacle[obstacle.length-1].xPosition + obstacleDistance, randomInteger(75, height - passingHeight-75)) );
        }
        birds = birds.filter(function (b) {
            return b.gameOver == false;
        });
    }
    else {
        if (keyIsPressed) {
            setup();
        }
    }
}

function setupBirds() {
    currentBirds = [];
    currentBirds.push(new Bird(100,300));
    currentBirds.push(new Bird(100,200));
}

function showScore() {
    // text("Score: " + score.toString(), width/2, 40);
    let maxScore = 0;
    birds.forEach(b => {
        if (b.score > maxScore) {
            maxScore = b.score;
        }
    });
    text("Score: " + maxScore.toString(), width/2, 40);
}

function keyPressed() {
    switch(keyCode) {
        case 32:
            // bird.flap();
            birds.forEach(b => {
                b.flap();
            });
            break;
    }
    return false;
}

class Bird {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.top = this.y - birdSize/2;
        this.bottom = this.y + birdSize/2;
        this.left = this.x - birdSize/2;
        this.right = this.x + birdSize/2;
        this.wasInPipe = false;
        this.isInPipe = false;
        this.score = 0;
        this.gameOver = false;
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
        if (height <= ( this.y+ (birdSize/2) ) ) this.gameOver = true;
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