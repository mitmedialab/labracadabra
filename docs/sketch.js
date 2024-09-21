let font;
let word = "L A B R A C A D A B R A ";
let xOffset = 0;
let xOffsetBottom = 0;
let shiftDir = 1;
let bottomShiftDir = 1;
let animate = false;
let lastStartTime = 0;
let lastShiftTime = 0;
let intervalLong = 1500;
let intervalShort = 60;
let blurAmount = 1;
let canvas;
let scl;
let t = 0;
let blimpX, blimpY, blimpW, blimpH;
let ratX, ratY, ratW, ratH;
let foodcamX, foodcamY, foodcamW, foodcamH;
let cursorRat = false;
let foodcamColor = false;

let lastBlendTime = 0;
let intervalBlend = 3200;
let blendTime = 450;
let blending = false;

function preload() {
  font = loadFont("vera-hacked/Atlas Typewriter.otf");
  clocky = loadImage("img/clocky.png");
  blimp = loadImage("img/blimp.png");
  rodent = loadImage("img/mouse.png");
  dog = loadImage("img/dog.png");
  foodcam = loadImage("img/foodcam2.png");
  foodcamGray = loadImage("img/foodcam2.png");
  blendie = loadImage("img/blendie.png");
  customCursor = loadImage('img/rat_cursor.png');
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  scl = min(width, height) / 100; // Adjust scale based on screen size
  textFont(font);
  textAlign(CENTER, CENTER);
  textSize(scl * 4); // Adjust text size based on screen size
  fill(0);

  clocky.filter(GRAY);
  blimp.filter(GRAY);
  rodent.filter(GRAY);
  foodcamGray.filter(GRAY);
  dog.filter(GRAY);
  blendie.filter(GRAY);
  blendie.filter(BLUR, 1);

  resetLayout();
}

function resetLayout() {
  blimpW = width * 0.3;
  blimpH = blimpW * 0.6;
  blimpX = width * 0.6;
  blimpY = height * 0.3;

  ratW = min(width, height) * 0.15;
  ratH = ratW;
  ratX = width - ratW - scl * 3;
  ratY = height - ratH - scl * 3;

  foodcamW = width * 0.3;
  foodcamH = foodcamW * 0.75;
  foodcamX = width - foodcamW - scl;
  foodcamY = scl;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  scl = min(width, height) / 100;
  textSize(scl * 4);
  resetLayout();
}

function touchStarted() {
  return false;
}

function draw() {
  clear();
  t += 1;

  // Blimp movement
  if (mouseX > blimpX && mouseX < blimpX + blimpW && mouseY > blimpY && mouseY < blimpY + blimpH) {
    blimpX += mouseX < blimpX + (blimpW / 2) ? scl * 0.1 : -scl * 0.1;
    blimpY += mouseY < blimpY + (blimpH / 2) ? scl * 0.1 : -scl * 0.1;
  }
  blimpX = constrain(blimpX, 0, width - blimpW);
  blimpY = constrain(blimpY, 0, height - blimpH);

  // Foodcam
  if (mouseX > foodcamX && mouseX < foodcamX + foodcamW && mouseY > foodcamY && mouseY < foodcamY + foodcamH) {
    image(foodcam, foodcamX, foodcamY, foodcamW, foodcamH);
  } else {
    image(foodcamGray, foodcamX, foodcamY, foodcamW, foodcamH);
  }

  // Other images
  image(clocky, width * 0.4, height * 0.1 + t * 0.05, width * 0.2, width * 0.15);
  image(rodent, ratX, ratY, ratW, ratH);
  image(dog, width * 0.7, height - scl * 15, scl * 10, scl * 15);

  // Blendie
  if (millis() - lastBlendTime > intervalBlend + blendTime) {
    blending = false;
    lastBlendTime = millis();
    intervalBlend = random(1000, 3000);
  }
  let blendieX = width - scl * 10 + (blending ? sin(t * 0.1) * scl * 0.4 : 0);
  let blendieY = height - scl * 56;
  image(blendie, blendieX, blendieY, scl * 18, scl * 36);

  // Text animation
  let x = width / 2;
  let lineHeight = scl * 4.2;
  let yStart = lineHeight;

  if (!animate && millis() - lastStartTime > intervalLong) {
    lastStartTime = millis();
    animate = true;
    shiftDir = random([-1, 1]);
    bottomShiftDir = random([-1, 1]);
    intervalLong = Math.pow(random(13, 64), 2);
    intervalShort = random(30, 90);
  }

  if (animate && millis() - lastShiftTime > intervalShort) {
    xOffset += 2 * shiftDir;
    xOffsetBottom += 2 * bottomShiftDir;
    lastShiftTime = millis();
    lastStartTime = millis();
  }

  if (xOffset >= word.length || xOffset <= -word.length) {
    animate = false;
  }

  xOffset = xOffset % word.length;
  xOffsetBottom = xOffsetBottom % word.length;

  // Draw text
  drawTextPyramid(x, yStart, lineHeight);

  image(blimp, blimpX, blimpY, blimpW, blimpH);
}

function drawTextPyramid(x, yStart, lineHeight) {
  // Top triangle
  for (let i = word.length; i > 6; i -= 2) {
    fill(i == word.length ? 0 : 69);
    let currentLine = word.substring(0, i);
    let shiftedLine = currentLine.slice(-xOffset) + currentLine.slice(0, -xOffset);
    text(shiftedLine, x, yStart);
    if (i == 6) {
      text("M E D I A   ", x - width * 0.34, yStart);
    }
    yStart += lineHeight;
  }

  // Middle
  let currentLine = word.substring(0, 6);
  let shiftedLine = currentLine.slice(-xOffset) + currentLine.slice(0, -xOffset);
  text(shiftedLine, x, yStart);
  yStart += lineHeight;

  // Bottom triangle
  for (let i = 8; i <= word.length; i += 2) {
    fill(i == word.length ? 0 : 69);
    let currentLine = word.substring(0, i);
    let shiftedLine = currentLine.slice(-xOffsetBottom) + currentLine.slice(0, -xOffsetBottom);
    text(shiftedLine, x, yStart);
    yStart += lineHeight;
  }
}