// --------------------AI Parameters--------------------

let networkLayers = [4, 1];

let crossoverUniformity = 0.5;
let mutationProbability = 0.8;
let mutationProbabilityIncrement = 0.05;
let maxMutationProbability = 0.95;
let tournamentSize = 50;
let elitism = false;
let randomIndividuals = 0;
let currentGeneration;
let generationSize = 500;

// --------------------Game Parameters--------------------

let flapPower = -5;
let gravity = 0.25;
let obstacleSpeed = -3;
let birdSize = 40;
let obstacle = [];
let obstacleWidth = 75;
let passingHeight = 3*birdSize; 
let obstacleDistance = 3.8 * obstacleWidth;

// --------------------AI Variables--------------------

let highscore = 0;
let currentBirds = [];
let ga;
let undeadPlayers;

// --------------------Resource Variables--------------------

let img;
let bg;
let pipel;
let pipeu;
let font;
let fontSize = 40;
let fontPath = "assets/fonts/theboldfont.ttf";


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
    // setupBirds();
    // birds = currentBirds;
    if (!ga) {
        ga = new GeneticAlgorithm();
    }
    undeadPlayers = currentGeneration.individuals;
    obstacle = [];
    obstacle.push(new Obstacle(400,randomInteger(75, height - passingHeight-75)));
    obstacle.push(new Obstacle(400 + obstacleDistance,randomInteger(75, height - passingHeight-75)));
    obstacle.push(new Obstacle(400 + 2* obstacleDistance,randomInteger(75, height - passingHeight-75)));
    obstacle.push(new Obstacle(400 + 3* obstacleDistance,randomInteger(75, height - passingHeight-75)));
    obstacle.push(new Obstacle(400 + 4* obstacleDistance,randomInteger(75, height - passingHeight-75)));
    obstacle.push(new Obstacle(400 + 5* obstacleDistance,randomInteger(75, height - passingHeight-75)));
}

function draw () {
    if (undeadPlayers.length != 0) {
        // background(color(135,26,250));
        background(bg);
        undeadPlayers.forEach(p => {
            p.takeTurn();
            p.bird.update();
            p.bird.show();
        });
        obstacle.forEach(o => {
            o.update();
            o.show();
        });
        fill(255);
        showScore();
        obstacle.forEach(o =>    {
            undeadPlayers.forEach(p => {
                if( (p.bird.top < o.upperHeight || p.bird.bottom > o.lowerHeight) && (p.bird.right > o.left && p.bird.left < o.right) ){
                    p.bird.gameOver = true;
                }
                if (p.bird.right > o.left && p.bird.left < o.right) {
                    p.bird.isInPipe = true;
                }
            });
        });
        undeadPlayers.forEach(p => {
            if (p.bird.wasInPipe && !p.bird.isInPipe) {
                p.bird.score++;
                p.bird.wasInPipe = false;
            }
            else {
                p.bird.wasInPipe = p.bird.isInPipe;
                p.bird.isInPipe = false;
            }
        });
        if(obstacle[0].xPosition <= -obstacleWidth){
            obstacle.shift();
            obstacle.push( new Obstacle(obstacle[obstacle.length-1].xPosition + obstacleDistance, randomInteger(75, height - passingHeight-75)) );
        }
        undeadPlayers = undeadPlayers.filter(function (p) {
            return p.bird.gameOver == false;
        });
    }
    else {
        ga.formNextGeneration();
        setup();
    }
}

function showScore() {
    let maxScore = 0;
    undeadPlayers.forEach(p => {
        if (p.bird.score > maxScore) {
            maxScore = p.bird.score;
        }
    });
    highscore = math.max(highscore, maxScore);
    text("Score: " + maxScore.toString(), width/2, 40);
    text("Generation: " + currentGeneration.generationNumber.toString(), width/2, 100);
    text("Record: " + highscore.toString(), width/2, 160);
}

// function keyPressed() {
//     switch(keyCode) {
//         case 32:
//             birds.forEach(b => {
//                 b.flap();
//             });
//             break;
//     }
//     return false;
// }

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
        if ( (this.top <= 0) || (this.bottom >= height) ) this.gameOver = true;;
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
        image(pipeu,this.left, this.upperHeight, obstacleWidth, passingHeight-height );
        image(pipel,this.left, this.lowerHeight, obstacleWidth, height - passingHeight );
    }
    update()    {
        this.xPosition  += obstacleSpeed;
        this.left = this.xPosition;
        this.right = this.xPosition + obstacleWidth;
    } 
 }


//--------------------ARTIFICIAL INTELLIGENCE--------------------

// Inputs: 
//      - distance to next pipe
//      - distance to top of next pipe
//      - distance to bottom of next pipe
//      - y velocity of bird

// Output:
//      - flap or not



//--------------------NEURAL NETWORK--------------------

class Network {
    constructor(layerSizes) {
        this.numLayers = layerSizes.length;
        this.layerSizes = layerSizes;
        this.biases = [];
        this.weights = []; 
    }
    generateParameters() {
        for (let i in this.layerSizes) {
            if (i==0) continue;
            this.biases.push( math.matrix(math.random( [this.layerSizes[i], 1], -1, 1)) );
            this.weights.push( math.matrix(math.random( [this.layerSizes[i], this.layerSizes[i-1]], -1, 1)) );
        }

    }
    setParameters(parameters) {
        this.weights = parameters[0];
        this.biases = parameters[1];
    }
    feedforward(inputs) {
        let activations = inputs;
        for (let i in this.biases) {
            activations = relu( math.add( math.multiply(this.weights[i], activations), math.flatten(this.biases[i]) ) );
        }
        return activations;
    }
}

function relu(matrix) {
    return math.map(matrix, function(value) {
        return math.max(value, 0);
    });
}


//--------------------GENETIC ALGORITHM--------------------

class Individual {
    constructor() {
        this.bird = new Bird();
        this.network = new Network(networkLayers);
    }
}

class Generation {
    constructor(population, createRandom) {
        this.population = population;
        this.individuals = [];
        this.generationNumber = 1;
        this.defeated = false;
        if (createRandom) {
            for (let i=0 ; i<population ; i++) {
                let individual = new AIPlayer();
                individual.network.generateParameters();
                this.individuals.push(individual);
            }
        } else {
            for (let i=0 ; i<population ; i++) {
                this.individuals.push(new AIPlayer());
            }
        }
    }
}

class GeneticAlgorithm {
    constructor() {
        this.generationNumber = null;
        currentGeneration = new Generation(generationSize, true);
    }
    crossover(player1, player2) {
        let player1genes = player1.mutate();
        let player2genes = player2.mutate();
        let player1weights = player1genes[0];
        let player1biases = player1genes[1];
        let player2weights = player2genes[0];
        let player2biases = player2genes[1];
        let newWeights = math.clone(player1weights);
        let newBiases = math.clone(player1biases);
        for (let i in newWeights) {
            let w = newWeights[i];
            w = math.map(w, function(value, index) {
                if (math.random() < crossoverUniformity) {
                    return player2weights[i].get(index);
                } else {
                    return value;
                }
            });
        }
        for (let i in newBiases) {
            let b = newBiases[i];
            b = math.map(b, function(value, index) {
                if (math.random() < crossoverUniformity) {
                    return player2biases[i].get(index);
                } else {
                    return value;
                }
            });
        }
        return [newWeights, newBiases];
    }
    formNextGeneration() {
        // generationSize = math.max(10, generationSize/2);
        let randomIndividualsNeeded = randomIndividuals;
        // mutationProbability = math.min(maxMutationProbability, mutationProbability + mutationProbabilityIncrement);
        let nextGeneration = new Generation(generationSize, false);
        let loopCounter = generationSize;
        if (elitism) {
            let maxFitnessIndex = 0;
            let maxFitness = currentGeneration.individuals[0].bird.fitness;
            for (let i in currentGeneration) {
                let individual = currentGeneration[i];
                if (individual.fitness > maxFitness) {
                    maxFitness = individual.fitness;
                    maxFitnessIndex = i;
                }
            }
            nextGeneration.individuals[generationSize-1].network.setParameters( [currentGeneration.individuals[maxFitnessIndex].network.weights, currentGeneration.individuals[maxFitnessIndex].network.biases] );
            loopCounter--;
        }
        while (randomIndividualsNeeded > 0) {
            nextGeneration.individuals[loopCounter - 1].network.generateParameters();
            loopCounter--;
            randomIndividualsNeeded--;
        }
        for (let i=0 ; i<loopCounter ; i++) {
            nextGeneration.individuals[i].network.setParameters( this.conductTournament() );
        }
        nextGeneration.generationNumber = currentGeneration.generationNumber + 1;
        currentGeneration = nextGeneration;
    }
    conductTournament() {
        let players = [];
        for (let i=0 ; i<tournamentSize ; i++) {
            players.push(currentGeneration.individuals[parseInt(math.random() * currentGeneration.individuals.length)]);
        }
        let maxFitness = players[0].fitness;
        let maxFitnessIndex = 0;
        for (let i in players) {
            let player = players[i];
            if (player.fitness >= maxFitness) {
                maxFitnessIndex = i;
                maxFitness = player.fitness;
            }
        }
        let winners = [];
        winners.push(players[maxFitnessIndex]);
        players.splice(maxFitnessIndex, 1);
        maxFitnessIndex = 0;
        maxFitness = players[maxFitnessIndex].fitness;
        for (let i in players) {
            let player = players[i];
            if (player.fitness >= maxFitness) {
                maxFitnessIndex = i;
                maxFitness = player.fitness;
            }
        }
        winners.push(players[maxFitnessIndex]);
        return this.crossover(winners[0], winners[1]);
    }
}

class AIPlayer {
    constructor() {
        this.bird = new Bird(400 - obstacleDistance + birdSize, 200 + 200*math.random());
        // this.bird = new Bird(100, 300);
        this.network = new Network(networkLayers);
        this.inputs = [0, 0, 0, 0];
        this.inputVector = null;
        this.fitness = 0;
    }
    takeTurn() {
        this.updateInputs();
        this.takeFlapDecision();
        this.fitness++;
    }
    updateInputs() {
        let nextObstacle = null;
        for (let i=0 ; i<10 ; i++) {
            if ( !( (obstacle[i].xPosition + obstacleWidth) < this.bird.left ) ) {
                nextObstacle = obstacle[i];
                break;
            }
        }
        this.inputs[0] = (2*(nextObstacle.xPosition - this.bird.right)/obstacleDistance) - 1;       //x-distance to next pipe
        this.inputs[1] = (2*(nextObstacle.upperHeight - this.bird.top)/height) - 1;                 //y-distance to top of pipe
        this.inputs[2] = (2*(nextObstacle.lowerHeight - this.bird.bottom)/height) - 1;              //y-distance to bottom of pipe
        this.inputs[3] = (2*this.bird.yVelocity/(math.sqrt(2*gravity*height))) - 1;
        this.inputVector = math.matrix(this.inputs);
    }
    takeFlapDecision() {
        if (math.trace(this.network.feedforward(this.inputVector))) {
            this.bird.flap();
        }
    }
    mutate() {
        let newWeights = math.clone(this.network.weights);
        let newBiases = math.clone(this.network.biases);
        newWeights.forEach(w => {
            w = math.map(w, function(value) {
                if (math.random() < mutationProbability) {
                    return math.random(-1, 1);
                } else {
                    return value;
                }
            });
        });
        newBiases.forEach(b => {
            b = math.map(b, function(value) {
                if (math.random() < mutationProbability) {
                    return math.random(-1, 1);
                } else {
                    return value;
                }
            });
        });
        return [newWeights, newBiases];
    }
}