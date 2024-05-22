// Selecting Html element
const board = document.getElementById("game-board");

const instructionText = document.getElementById("instruction-text");

const logo = document.getElementById("logo")

const score = document.getElementById("score");

const highScore = document.getElementById("highScore")


// define game variables
let snake = [{ x: 10, y: 10 }];

let gridSize = 20;

let food = GenerateFood();

let direction = "left";

let gameInterval;

let gameSpeedDelay=250;

let gameStarted = false; 

let hScore = 0;

var audio = new Audio ('audio.mp3');
function playAudioFromStart() {
  audio.muted = false
  audio.loop = true
  audio.currentTime = 0; // Set current time to 0 (beginning)
  audio.play(); // Play the audio
}


// draw game map, snake and food
function draw() {
  console.log(gameSpeedDelay);
  board.innerHTML = "";
  drawSnake();
  drawFood();
  updateScore()
}

// Draw snake
function drawSnake() {
 if(gameStarted){
    snake.forEach((segment,index) => {
        if(index == 0) {
         const snakeElement = createGameElement("div", "head");
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
        }else{
        const snakeElement = createGameElement("div", "snake");
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
        }
        
      });
 }
}

// creating snake element
function createGameElement(tag, class_Name) {
  const element = document.createElement(tag);
  element.className = class_Name;
  return element;
}

// Set snake position according snake segments
function setPosition(snakeElement, segment) {
  snakeElement.style.gridColumn = segment.x;
  snakeElement.style.gridRow = segment.y;
}

// drawing the food
function drawFood() {
  if(gameStarted){
    const foodElement = createGameElement("div", "food");
  setPosition(foodElement, food);
  board.appendChild(foodElement);
  }
}

// generating food element
function GenerateFood() {
    let newFood;
    do {
      newFood = { x: Math.floor(Math.random() * gridSize) + 1, y: Math.floor(Math.random() * gridSize) + 1 };
    } while (checkIfCollidesWithSnake(newFood)); // Check for collision with snake
    return newFood;
  }
  
  function checkIfCollidesWithSnake(position) {
    // Check if position overlaps with any snake segment
    for (const segment of snake) {
      if (segment.x === position.x && segment.y === position.y) {
        return true;
      }
    }
    return false;
  }

// move the snake
function move() {
  const head = { ...snake[0] };
  switch (direction) {
    case 'up':
      head.y--;
      break;
    case 'down':
      head.y++;
      break;
    case 'right':
      head.x++;
      break;
    case 'left':
      head.x--;
      break;
  }
  snake.unshift(head);

// creating head
// snake[0].style.backgroundColor = "red"

  if(head.x==food.x && head.y==food.y){
    food = GenerateFood();
    increaseSpeed();
    clearInterval(gameInterval); // clear past interval
   gameInterval = setInterval(()=>{
    move();
    checkCollision();
    draw();
   },gameSpeedDelay)
  }else snake.pop();
}

// increase the speed after every eat 
function  increaseSpeed(){
    if(gameSpeedDelay>150){
        gameSpeedDelay-=10;
        console.log(gameSpeedDelay);
    }else if(gameSpeedDelay>100){
        gameSpeedDelay-=5;
        console.log(gameSpeedDelay);
    }
    else if(gameSpeedDelay>50){
        gameSpeedDelay-=2;
        console.log(gameSpeedDelay);
    }
    else if(gameSpeedDelay>20){
        gameSpeedDelay-=1;
        console.log(gameSpeedDelay);
    }
}

// let test = 0;
// // testing movement
// setInterval(()=>{
//     test++;
//     move();// move first 
//     draw();// then draw new position
//     console.log(test);
// },100);

// Game Start function
function gameStart(){
  playAudioFromStart()
  console.log("game start");
  gameStarted = true; // keep track of running game
  instructionText.style.display = "none";
  logo.style.display = "none";
  gameInterval = setInterval(() => {
      move();
      draw();
      checkCollision();
  }, gameSpeedDelay);
}


// keypress eventListener
function handleKeyPress(event){

    if(
        (!gameStarted && event.code === "space")
    ||
        (!gameStarted && event.key === " ")
    ){
        gameStart();
    }
  else{
    switch (event.code) {
        case "ArrowUp":
            direction = 'up';
            break;
            case "ArrowDown":
                direction = 'down';
                break;
                case "ArrowRight":
                    direction = 'right';
                    break;
                    case "ArrowLeft":
                        direction = 'left';
                        break;

    }
  }
}

document.addEventListener("keydown",handleKeyPress);// here funtion is already defined so reference is passed or istead we can write whole hadleKeyPress function 

function checkCollision(){
     const head = {...snake[0]}
     if(head.x<1 || head.x>gridSize || head.y<1 || head.y>gridSize){
        resetGame();
     }
     for(let i =1;i<snake.length;i++){
        if(head.x === snake[i].x && head.y === snake[i].y ){
            resetGame();
        }
     }
}
function resetGame(){
    stopGame();
     updateHighScore();
    snake = [{ x: 10, y: 10 }];
    food = GenerateFood()
    gameSpeedDelay = 250;
    direction = "left"
    updateScore();  
    draw()
}

function updateScore() {
    if (gameStarted && snake.length > 0) {
        const currentScore = snake.length - 1;
        score.textContent = currentScore.toString().padStart(3, "0");
    }
}

function stopGame(){
    audio.muted = true;
    console.log("game stop");
    clearInterval(gameInterval); // Clear the interval here
    gameStarted = false;
    instructionText.style.display = "block";
    logo.style.display = "block";
  }
// updating high score
  function updateHighScore(){
    if(hScore<snake.length){
      hScore = snake.length-1
    }
    highScore.textContent= hScore.toString().padStart(3, "0");
  }

  

  