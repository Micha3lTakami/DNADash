title = "DNA Dash";

description = `
[Tap] Jump
`;

characters = [
  // This could be your runner character
  `
   gg
  gGGg
  gllg
  gGGg
  gGGg
   gg
  `
  // You can add more characters for obstacles, etc.
];

const G = {
  WIDTH: 150,
  HEIGHT: 90,
  GRAVITY: 0.25,
  JUMP_POWER: 5.25,
  RUN_SPEED: 1
};

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 11,
  theme: "crt"
};

let runner;
let obstacles;

function update() {
  if (!ticks) {
    // Initialization code
    runner = {
      pos: vec(20, G.HEIGHT - 10),
      vy: 0 // Vertical velocity
    };
    obstacles = [];
  }

  // Runner logic
  // Runner logic
  let wasOnGround = runner.pos.y >= G.HEIGHT - 10;
  runner.vy += G.GRAVITY;
  runner.pos.y += runner.vy;

  let isOnGround = runner.pos.y >= G.HEIGHT - 10;
  if (isOnGround) {
    runner.pos.y = G.HEIGHT - 10;
    runner.vy = 0;
    // Check if the runner just landed
    if (!wasOnGround) {
      // Particle effect when the runner hits the ground
      color("black");
      particle(runner.pos.x, runner.pos.y, 40,  PI/ 2);
    }
  }

  if (input.isJustPressed && isOnGround) {
    runner.vy = -G.JUMP_POWER;
  }

  // Obstacle logic
  if (ticks % 60 === 0) {
    const amplitude = rnd(10, 20); // Random amplitude for vertical movement
    const frequency = rnd(0.05, 0.1); // Random frequency for vertical movement
    obstacles.push({
      pos: vec(G.WIDTH, G.HEIGHT - 10),
      amplitude: amplitude,
      frequency: frequency,
      initialY: G.HEIGHT - 15,
      initialTicks: ticks
    });
  }

  obstacles = obstacles.filter((o) => {
    o.pos.x -= G.RUN_SPEED;
    // Update vertical position based on sine function
    o.pos.y = o.initialY + Math.sin((ticks - o.initialTicks) * o.frequency) * o.amplitude;

        // Check if the obstacle has just passed the runner
        if (o.pos.x < runner.pos.x && !o.passed) {
          o.passed = true; // Mark the obstacle as passed
          addScore(1); // Increment the score
        }
    
    return o.pos.x > -10;
  });

  // Draw obstacles
  
  obstacles.forEach((o) => {
    color("red");
    box(o.pos.x, o.pos.y - 5, 12, 12);

    color("blue");
    for (let i = 0; i < G.WIDTH; i += 5) {
      const pathY = o.initialY + Math.sin((i / G.RUN_SPEED + o.initialTicks) * o.frequency) * o.amplitude;
      box(o.pos.x - (G.WIDTH - i), pathY, 2, 2);
    }
    
  });

    // Draw runner
    color("black");
    char("a", runner.pos.x, runner.pos.y);
  
  // Collision detection
  obstacles.forEach((o) => {
    if (char("a", runner.pos).isColliding.rect.red) {

      end();
    }
  });


}
