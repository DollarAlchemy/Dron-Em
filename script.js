const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

// Game variables
let player = { x: 50, y: 50, width: 30, height: 30, dx: 0, dy: 0, speed: 5 };
let animals = [];
let score = 0;
let maxScore = 0;
let totalAnimals = 0;
let currentMapIndex = 0;
let transition = false;

// Maze data
const mazes = [
  {
    walls: [
      { x: 0, y: 0, width: 800, height: 10 },
      { x: 0, y: 0, width: 10, height: 600 },
      { x: 790, y: 0, width: 10, height: 600 },
      { x: 0, y: 590, width: 800, height: 10 },
      { x: 200, y: 10, width: 10, height: 200 },
      { x: 200, y: 200, width: 400, height: 10 },
      { x: 600, y: 200, width: 10, height: 200 },
      { x: 400, y: 400, width: 200, height: 10 },
      { x: 10, y: 400, width: 200, height: 10 },
      { x: 300, y: 300, width: 10, height: 200 },
    ],
    animals: [
      { x: 750, y: 50, radius: 15, color: '#ffcc00' },
      { x: 400, y: 500, radius: 15, color: '#00ccff' },
    ],
  },
  {
    walls: [
      { x: 0, y: 0, width: 800, height: 10 },
      { x: 0, y: 0, width: 10, height: 600 },
      { x: 790, y: 0, width: 10, height: 600 },
      { x: 0, y: 590, width: 800, height: 10 },
      { x: 100, y: 100, width: 600, height: 10 },
      { x: 100, y: 100, width: 10, height: 400 },
      { x: 700, y: 100, width: 10, height: 400 },
      { x: 100, y: 500, width: 600, height: 10 },
      { x: 300, y: 300, width: 200, height: 10 },
    ],
    animals: [
      { x: 50, y: 550, radius: 15, color: '#ff9900' },
      { x: 750, y: 550, radius: 15, color: '#cc00ff' },
    ],
  },
];

// Load the initial maze
function loadMaze(index) {
  const maze = mazes[index];
  animals = maze.animals.map((animal) => ({ ...animal }));
  maxScore += animals.length;
  totalAnimals += animals.length;
  transition = true; // Trigger transition effect
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

// Check collision with walls
function checkWallCollision(player, wall) {
  return (
    player.x < wall.x + wall.width &&
    player.x + player.width > wall.x &&
    player.y < wall.y + wall.height &&
    player.y + player.height > wall.y
  );
}

// Check if player reaches an animal
function checkAnimalCollision(animal) {
  const dx = player.x + player.width / 2 - animal.x;
  const dy = player.y + player.height / 2 - animal.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < animal.radius + player.width / 2;
}

// Update game state
function update() {
  player.x += player.dx;
  player.y += player.dy;

  // Check wall collisions
  for (let wall of mazes[currentMapIndex].walls) {
    if (checkWallCollision(player, wall)) {
      // Undo movement
      player.x -= player.dx;
      player.y -= player.dy;
    }
  }

  // Check animal collisions
  animals.forEach((animal, index) => {
    if (checkAnimalCollision(animal)) {
      score++;
      animals.splice(index, 1);
    }
  });

  // Check if maze is completed
  if (animals.length === 0 && !transition) {
    currentMapIndex++;
    if (currentMapIndex < mazes.length) {
      loadMaze(currentMapIndex);
    } else {
      alert(`Game Over! Total Score: ${score} / ${totalAnimals}`);
      location.reload();
    }
  }
}

// Draw the game
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw walls
  ctx.fillStyle = '#555';
  for (let wall of mazes[currentMapIndex].walls) {
    ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
  }

  // Draw animals
  animals.forEach((animal) => {
    ctx.fillStyle = animal.color;
    ctx.beginPath();
    ctx.arc(animal.x, animal.y, animal.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw player
  ctx.fillStyle = '#ff9900';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Draw score
  ctx.fillStyle = '#fff';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score} / ${totalAnimals}`, 10, 20);
}

// Game loop
function gameLoop() {
  if (transition) {
    ctx.fillStyle = '#000';
    ctx.fillText('Loading...', canvas.width / 2 - 50, canvas.height / 2);
    setTimeout(() => {
      transition = false;
      requestAnimationFrame(gameLoop);
    }, 1000);
    return;
  }

  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start the game
loadMaze(currentMapIndex);
gameLoop();
