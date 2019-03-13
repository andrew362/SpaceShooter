let context, controler, rectangle, bullet, block, loop;
let nextBullet = true;
let timer = 0;
let hiscoreStorage = localStorage.getItem('AsteroidGame') || 0;
let hiscoreScreen = document.getElementById('hiscore'); 
let asterArray = [];
let starsArray = [];
let gameOverFlag = false;
let score = 0;
const scoreDiv = document.getElementById('score');
context = document.getElementsByTagName('canvas')[0].getContext('2d');
const meteor = document.getElementById('meteor');
let ship = document.getElementById('ship');
let explosion = document.getElementById('explosion');

hiscoreScreen.textContent = hiscoreStorage;

context.canvas.height = 600;
context.canvas.width = 400;

rectangle = {
  height: 32,
  width: 32,
  x: context.canvas.width / 2,
  y: context.canvas.height - 32 - 5,
  x_v: 0,
  y_v: 0
};

bullet = {
  height: 16,
  width: 6,
  x: 0,
  y: -100,
  x_v: 0,
  y_v: 0
};


controler = {
  left: false,
  right: false,
  up: false,
  keyListener: function (event) {
    var keyState = false;
    if (event.type == 'keydown') {
      keyState = true;
    }

    switch (event.keyCode) {
      case 37:
        controler.left = keyState;
        break;
      case 38:
        controler.up = keyState;
        break;
      case 39:
        controler.right = keyState;
        break;
    }
  }
};

class Blocks {
  constructor(positionConst, sizeConst, speedConst) {
    this.size = this.randomSize(sizeConst);
    this.x = this.randomPosition(positionConst);
    this.y = 0;
    this.width = this.size;
    this.height = this.size;
    this.y_v = this.randomSpeed(speedConst);
    this.positionCons = positionConst;
    this.sizeConst = sizeConst;
    this.speedConst = speedConst;
  }
  randomPosition(positionConst) {
    return positionConst + Math.floor(Math.random() * 350);
  }
  randomSize(sizeConst) {
    return sizeConst + Math.floor(Math.random() * 30);
  }
  randomSpeed(speedConst) {
    return speedConst + Math.random() * timer / 1000;

  }
};

function collision(bullet, asteroid, id) {
  if ((bullet.x + bullet.width / 2 >= asteroid.x) && (bullet.x + bullet.width / 2 <= asteroid.x + asteroid.width) && (bullet.y <= asteroid.y) && (bullet.y >= asteroid.height)) {
    console.log('trafiony');
        asterArray.splice(id, 1);
    score += 1;
    scoreDiv.innerHTML = score;
  }

}

function collisionGroundCheck(asteroid) {
  if (asteroid.y + asteroid.height > context.canvas.height - 4) {
    gameOverFlag = true;
    for (let i = 1; i <= 20; i++) {
      context.drawImage(explosion, context.canvas.width / 20 * (i - 2), context.canvas.height - 25, context.canvas.width / 8, 50);
    }
  }
}

function collisionShipCheck(asteroid, rectangle) {

  if (asteroid.y + asteroid.height > context.canvas.height - rectangle.height && asteroid.x + asteroid.width > rectangle.x && asteroid.x < rectangle.x + rectangle.width) {
    gameOverFlag = true;
    context.drawImage(explosion, rectangle.x - 15, rectangle.y - 15, rectangle.width + 30, rectangle.height + 30);
  }
}

function generateAster() {
  var asteroid = new Blocks(5, 20, 1);
  asterArray.push(asteroid);
}

loop = function () {
  timer += 1;

  if (gameOverFlag) {
    gameOver();
    return;
  } else {
    start();
  }


  if (timer % 100 == 0) {
    generateAster();
  }

  if (controler.left) {
    rectangle.x_v += -1;
  }
  if (controler.up && nextBullet) {

    bullet.x = rectangle.x + rectangle.width / 2 - bullet.width / 2;
    bullet.y = rectangle.y;
    bullet.y_v -= 15;
    nextBullet = false;
  }
  if (controler.right) {
    rectangle.x_v += 1;
  }

  rectangle.x += rectangle.x_v;
  bullet.y += bullet.y_v;
  rectangle.x_v *= 0.8; // friction


  if (bullet.y < -20) {
    bullet.y_v = 0;
    nextBullet = true;
  }

  if (rectangle.x > context.canvas.width - rectangle.width - 5 || rectangle.x < 5) {

  }

  if (rectangle.x >= context.canvas.width - rectangle.width) {
    rectangle.x = context.canvas.width - rectangle.width;
  }
  if (rectangle.x <= 0) rectangle.x = 0;


  context.fillStyle = "#000";
  context.fillRect(0, 0, context.canvas.width, context.canvas.height); // x, y, width, height
  context.fillStyle = "#ff0000";
  context.beginPath();
  context.rect(bullet.x, bullet.y, bullet.width, bullet.height);
  context.fill();
  // context.fillStyle = "#f00";
  // context.fillRect(0, 0, 5, context.canvas.height);
  // context.fillRect(context.canvas.width, 0, -5, context.canvas.height);

  context.fillStyle = "#00ff00";
  context.beginPath();
  context.drawImage(ship, rectangle.x, rectangle.y, rectangle.width, rectangle.height);
  context.fill();



  if (asterArray.length > 0) {
    for (let i = 0; i < asterArray.length; i++) {
      asterArray[i].y += asterArray[i].y_v;


      if (asterArray.length > 0) {
        context.fillStyle = "#333";
        context.beginPath();
        context.drawImage(meteor, asterArray[i].x, asterArray[i].y, asterArray[i].width, asterArray[i].height);
        context.fill();
        collisionGroundCheck(asterArray[i]);
        collisionShipCheck(asterArray[i], rectangle);
        collision(bullet, asterArray[i], i);
      }
    }
  }

};





window.addEventListener('keydown', controler.keyListener);
window.addEventListener('keyup', controler.keyListener);


function start() {
  window.requestAnimationFrame(loop);
}

function gameOver() {
  window.cancelAnimationFrame(loop);
  if(hiscoreStorage < score){
    localStorage.setItem('AsteroidGame', score);
  }


  if (confirm("GAME OVER \nJeszcze raz?")) {
    location.reload();
  }
}

start();