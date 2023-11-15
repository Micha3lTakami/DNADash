title = "Division Bomb";

description = `  
 [Hold]
  Cycle Wires

 [Release] 
   Cut Wire
`;

// Game constants
const G = {
  WIDTH: 100,
  HEIGHT: 100,
  START_TIME: 3, // starting time per bomb in seconds
  TIME_DECREASE: 0.25, // time decrease per 100 bombs defused
  SCORE_THRESHOLD: 100
};

options = {
  viewSize: {x: G.WIDTH, y: G.HEIGHT},
  isPlayingBgm: true,
  //isReplayEnabled: true,
  theme: "crt",
  seed: 6666
  //,isDrawingParticleFront: true
};
let buttonPressDuration;
let currentNumber;
let timeLeft;
let bombsDefused = 0;
let currentChoice = 0; // 0: None, 1: Red, 2: Blue, 3: Yellow

let quickDefusals = 0; // Track quick defusals
let scoreMultiplier = 1; // Score multiplier
score = 0; // Total score

function update() {
  // start()
  if (!ticks) {
    // Initialization code
    buttonPressDuration = 0;
    currentChoice = 0;
    timeLeft = G.START_TIME;
    bombsDefused = 0;
    currentNumber = 1;
    quickDefusals = 0;
    scoreMultiplier = 1;
    score = 0;
  }

  timeLeft -= 1 / 60;
    
  // Check for game over condition
  if (timeLeft <= 0) {
    // Game over logic
    end();
  
  }

  // Draw the bomb with the current number
  color("black");
  box(50,50,80, 50);

  text(`Wire: ${currentChoice}`, 10, 20);
  text(`Number: ${currentNumber}`, 10, 10);
  /*
  const timeLeftText = timeLeft.toFixed(2);
  color("black");
  text('Time ${timeLeftText}', 15, 2);
  */

  // Cycle through wire options on button hold
  // Check if the button is pressed
  if (input.isPressed) {
    buttonPressDuration++;
    if (buttonPressDuration >= 60) { // 60 frames = 1 second
      currentChoice = (currentChoice + 1) % 4; // Cycle through 0 to 3
      buttonPressDuration = 0; // Reset the counter
    }
  } else {
    buttonPressDuration = 0; // Reset the counter if the button is released
  }


  // Check wire cutting on button release
  // Check wire cutting on button release
  if (input.isJustReleased) {
    let timeUsed = G.START_TIME - timeLeft;
    if (checkCorrectWire(currentNumber, currentChoice)) {
      let baseScore = 10; // Base score for defusing a bomb
      bombsDefused++;
      currentNumber++;

      // Calculate bonus score based on time taken
      if (timeUsed <= G.START_TIME * 0.25) { // Less than 25% of the time
        baseScore += 50;
        quickDefusals++;
      } else if (timeUsed <= G.START_TIME * 0.5) { // Less than 50% of the time
        baseScore += 25;
      } else {
        quickDefusals = 0; // Reset quick defusals if the player is too slow
      }

      // Update multiplier if necessary
      if (quickDefusals >= 5) {
        scoreMultiplier++;
        quickDefusals = 0; // Reset quick defusals after increasing multiplier
      }

      // Apply multiplier to score
      score += baseScore * scoreMultiplier;

      // Reset time for next bomb
      timeLeft = G.START_TIME - Math.floor(bombsDefused / G.SCORE_THRESHOLD) * G.TIME_DECREASE;
      timeLeft = Math.max(timeLeft, 1); // Ensure time doesn't go below 1 second
    } else {
      end(); // Wrong wire, game over
    }
  }

  // Draw score, time left, etc.
  //text(`Score: ${score}`, 10, 30);
  // Other drawing code...


  function checkCorrectWire(number, wire) {
    const isDiv2 = number % 2 === 0;
    const isDiv3 = number % 3 === 0;
    if (isDiv2 && isDiv3) return wire === 3; // Yellow Wire
    if (isDiv2) return wire === 1; // Red Wire
    if (isDiv3) return wire === 2; // Blue Wire
    return wire === 0; // None
  }
}

