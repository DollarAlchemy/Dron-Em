const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

// Game variables
let drone = { x: 400, y: 50, width: 50, height: 30, speed: 5 };
let foodDrops = [];
let animals = [
  { x: 100, y: 350, radius: 20 },
  { x: 300, y: 350, radius: 20 },
  { x: 500, y: 350, radius: 20 },
  { x: 700, y: 350, radius: 20 },
];
let score = 0;

// Handle key presses
let keys = {};
window.addEventListener("keydown", (e) => {
  keys[e.code] = true;
});
window.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

// Update game objects
function update() {
  // Drone movement
  if (keys["ArrowUp"] && drone.y > 0) drone.y -= drone.speed;
  if (keys["ArrowDown"] && drone.y < canvas.height - drone.height) drone.y += drone.speed;
  if (keys["ArrowLeft"] && drone.x > 0) drone.x -= drone.speed;
  if (keys["ArrowRight"] && drone.x < canvas.width - drone.width) drone.x += drone.speed;

  // Drop food
  if (keys["Space"]) {
    foodDrops.push({ x: drone.x + drone.width / 2, y: drone.y });
    keys["Space"] = false; // Prevent continuous drops
  }

  // Update food drops
  foodDrops.forEach((food, index) => {
    food.y += 5; // Food falls
    if (food.y > canvas.height) {
      foodDrops.splice(index, 1); // Remove off-screen food
    }

    // Check collision with animals
    animals.forEach((animal) => {
      const dx = food.x - animal.x;
      const dy = food.y - animal.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < animal.radius) {
        score++;
        foodDrops.splice(index, 1); // Remove food on collision
      }
    });
  });
}

// Draw game objects
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw drone
  ctx.fillStyle = "#333";
  ctx.fillRect(drone.x, drone.y, drone.width, drone.height);

  // Draw food
  ctx.fillStyle = "#ff9900";
  foodDrops.forEach((food) => {
    ctx.beginPath();
    ctx.arc(food.x, food.y, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw animals
  animals.forEach((animal) => {
    ctx.fillStyle = "#ffcc00";
    ctx.beginPath();
    ctx.arc(animal.x, animal.y, animal.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

  // Draw score
  ctx.fillStyle = "#000";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);
}

// Game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
