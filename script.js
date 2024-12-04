const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

let gameOver = false;
let score = 0;
let speed = 3;

// Cube player
const player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 100,
  width: 50,
  height: 50,
  dx: 0,
};

// Obstacles
const obstacles = [];
let obstacleInterval = 0;

// Controls
document.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') player.dx = -5;
  if (e.code === 'ArrowRight' || e.code === 'KeyD') player.dx = 5;
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') player.dx = 0;
  if (e.code === 'ArrowRight' || e.code === 'KeyD') player.dx = 0;
});

// Restart button
document.getElementById('restart-btn').addEventListener('click', () => {
  location.reload();
});

function drawPlayer() {
  ctx.fillStyle = '#ff9900';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
  ctx.fillStyle = '#ff0000';
  obstacles.forEach((obs) => {
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  });
}

function updateObstacles() {
  // Add new obstacles
  if (obstacleInterval % 100 === 0) {
    const width = Math.random() * (150 - 50) + 50;
    const x = Math.random() * (canvas.width - width);
    obstacles.push({ x, y: 0, width, height: 20 });
  }

  // Move obstacles
  obstacles.forEach((obs, index) => {
    obs.y += speed;

    // Check for collision
    if (
      player.x < obs.x + obs.width &&
      player.x + player.width > obs.x &&
      player.y < obs.y + obs.height &&
      player.y + player.height > obs.y
    ) {
      endGame();
    }

    // Remove off-screen obstacles
    if (obs.y > canvas.height) obstacles.splice(index, 1);
  });
}

function updatePlayer() {
  player.x += player.dx;

  // Prevent player from going off-screen
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

function endGame() {
  gameOver = true;
  document.getElementById('game-over').classList.remove('hidden');
  document.getElementById('final-score').innerText = score;
}

function drawScore() {
  ctx.fillStyle = '#fff';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
}

function gameLoop() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update game state
  updatePlayer();
  updateObstacles();

  // Draw game objects
  drawPlayer();
  drawObstacles();
  drawScore();

  // Increase difficulty
  score++;
  if (score % 500 === 0) speed += 0.5;

  // Manage obstacle interval
  obstacleInterval++;

  requestAnimationFrame(gameLoop);
}

gameLoop();
