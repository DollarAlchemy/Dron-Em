const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

// Game variables
let player = { x: 400, y: 500, width: 50, height: 50, dx: 0, dy: 0, speed: 5 };
let animals = [
  { x: 200, y: 100, radius: 20 },
  { x: 600, y: 300, radius: 20 },
  { x: 1200, y: 400, radius: 20 },
];
let obstacles = [];
let score = 0;
let gameOver = false;

// Create a larger map
const map = {
  width: 1600,
  height: 1200,
};

// Generate maze-like obstacles
for (let i = 0; i < 50; i++) {
  obstacles.push({
    x: Math.random() * map.width,
    y: Math.random() * map.height,
    width: Math.random() * 100 + 50,
    height: Math.random() * 100 + 50,
  });
}

// Controls
document.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowUp' || e.code === 'KeyW') player.dy = -player.speed;
  if (e.code === 'ArrowDown' || e.code === 'KeyS') player.dy = player.speed;
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') player.dx = -player.speed;
  if (e.code === 'ArrowRight' || e.code === 'KeyD') player.dx = player.speed;
});

document.addEventListener('keyup', (e) => {
  if (['ArrowUp', 'ArrowDown', 'KeyW', 'KeyS'].includes(e.code)) player.dy = 0;
  if (['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD'].includes(e.code)) player.dx = 0;
});

// Restart button
document.getElementById('restart-btn').addEventListener('click', () => {
  location.reload();
});

// Check collision with obstacles
function checkCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

// Check if player reaches an animal
function checkAnimalCollision(animal) {
  const dx = player.x + player.width / 2 - animal.x;
  const dy = player.y + player.height / 2 - animal.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < animal.radius + player.width / 2;
}

// Update game
function update() {
  if (gameOver) return;

  // Move player
  player.x += player.dx;
  player.y += player.dy;

  // Keep player within map bounds
  player.x = Math.max(0, Math.min(map.width - player.width, player.x));
  player.y = Math.max(0, Math.min(map.height - player.height, player.y));

  // Check collisions with obstacles
  for (let obstacle of obstacles) {
    if (checkCollision(player, obstacle)) {
      endGame();
    }
  }

  // Check collisions with animals
  animals.forEach((animal, index) => {
    if (checkAnimalCollision(animal)) {
      score++;
      animals.splice(index, 1); // Remove the animal
    }
  });

  // Game over if all animals are fed
  if (animals.length === 0) {
    endGame();
  }
}

// Draw the game
function draw() {
  // Clear the screen
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the map
  ctx.save();
  ctx.translate(-player.x + canvas.width / 2, -player.y + canvas.height / 2);

  // Draw obstacles
  ctx.fillStyle = '#555';
  obstacles.forEach((obs) => {
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  });

  // Draw animals
  animals.forEach((animal) => {
    ctx.fillStyle = '#ffcc00';
    ctx.beginPath();
    ctx.arc(animal.x, animal.y, animal.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw player
  ctx.fillStyle = '#ff9900';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  ctx.restore();

  // Draw score
  ctx.fillStyle = '#fff';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
}

// End the game
function endGame() {
  gameOver = true;
  document.getElementById('game-over').classList.remove('hidden');
  document.getElementById('final-score').innerText = score;
}

// Game loop
function gameLoop() {
  update();
  draw();
  if (!gameOver) requestAnimationFrame(gameLoop);
}

gameLoop();
