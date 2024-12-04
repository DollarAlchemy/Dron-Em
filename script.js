const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 500;

// Game variables
let drone = { x: 400, y: 50, width: 50, height: 30, speed: 5, fuel: 100 };
let foodDrops = [];
let animals = [
  { x: 150, y: 400, radius: 20 },
  { x: 350, y: 400, radius: 20 },
  { x: 600, y: 400, radius: 20 },
];
let score = 0;
let level = 1;
let gameOver = false;

// Key states
let keys = {};
window.addEventListener('keydown', (e) => (keys[e.code] = true));
window.addEventListener('keyup', (e) => (keys[e.code] = false));

// Game functions
function update() {
  if (gameOver) return;

  // Move drone
  if (keys['ArrowUp'] && drone.y > 0) drone.y -= drone.speed;
  if (keys['ArrowDown'] && drone.y < canvas.height - drone.height) drone.y += drone.speed;
  if (keys['ArrowLeft'] && drone.x > 0) drone.x -= drone.speed;
  if (keys['ArrowRight'] && drone.x < canvas.width - drone.width) drone.x += drone.speed;

  // Fuel consumption
  drone.fuel -= 0.05;
  if (drone.fuel <= 0) endGame();

  // Drop food
  if (keys['Space']) {
    foodDrops.push({ x: drone.x + drone.width / 2, y: drone.y });
    keys['Space'] = false;
  }

  // Update food drops
  foodDrops.forEach((food, index) => {
    food.y += 5;
    if (food.y > canvas.height) foodDrops.splice(index, 1);

    // Collision with animals
    animals.forEach((animal) => {
      const dx = food.x - animal.x;
      const dy = food.y - animal.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < animal.radius) {
        score++;
        foodDrops.splice(index, 1);
      }
    });
  });

  // Level progression
  if (score >= level * 10) {
    level++;
    drone.speed += 1;
    animals.push({
      x: Math.random() * (canvas.width - 40) + 20,
      y: 400,
      radius: 20,
    });
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw drone
  ctx.fillStyle = '#000';
  ctx.fillRect(drone.x, drone.y, drone.width, drone.height);

  // Draw food
  ctx.fillStyle = '#ff9900';
  foodDrops.forEach((food) => {
    ctx.beginPath();
    ctx.arc(food.x, food.y, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw animals
  animals.forEach((animal) => {
    ctx.fillStyle = '#ffcc00';
    ctx.beginPath();
    ctx.arc(animal.x, animal.y, animal.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  // HUD
  document.getElementById('fuel').innerText = `${Math.max(0, drone.fuel).toFixed(1)}%`;
  document.getElementById('score').innerText = score;
  document.getElementById('level').innerText = level;
}

function endGame() {
  gameOver = true;
  document.getElementById('game-over').classList.remove('hidden');
  document.getElementById('final-score').innerText = score;
}

document.getElementById('restart-btn').addEventListener('click', () => {
  location.reload();
});

function gameLoop() {
  update();
  draw();
  if (!gameOver) requestAnimationFrame(gameLoop);
}

gameLoop();
