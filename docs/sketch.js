let font;
//let word = "L A B R A C A D A B R A ";
let word = "L  A  B  R  A  C  A  D  A  B  R  A  ";
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
let fontSize;
let lineHeight;
let actualWidth;
let pyramidHeight;
let pyramidTop;
let marginLeft;
let rightLineX1, rightLineY1, rightLineX2, rightLineY2;
let leftLineX1, leftLineY1, leftLineX2, leftLineY2;



let lastBlendTime = 0;
let intervalBlend = 3200;
let blendTime = 600;
let blending = false;

let images = ["clocky", "blimp", "mouse", "dog", "blendie", "mack", "foodcam", "squirrel"]
let objects = [];

let centerX = 0;

function preload() {
  font = loadFont("vera-hacked/Atlas Typewriter.otf");
  font2 = loadFont("vera-hacked/Atlas Grotesk-Medium.otf");

  for (let i = 0; i < images.length; i++) {
    objects.push({
      img: loadImage("img/" + images[i] + ".png"),
      name: images[i],
      randomScale: random(0.7, 1.2),
      v: createVector(random(-1.5, 1.5), random(0, 2.5)),
      mass: random(10,20),
      w: 0,
      h : 0,
      x : 0,
      y : 0,
      isBlendie: images[i] == "blendie"
    });
    console.log("Loaded ", images[i]);
  }
}

function setup() {
  imageMode(CENTER);
  canvas = createCanvas(windowWidth, windowHeight);
  console.log("window: ", windowWidth, windowHeight);
  console.log("wxh: ", width, height);
  scl = min(width, height) / 100; // Adjust scale based on screen size
  console.log("scale: ", scl);

  if (windowWidth >= windowHeight) {
    actualWidth = width / 1.618;
    marginLeft = width - actualWidth;
    pyramidCenter = marginLeft + actualWidth / 2;
    pyramidHeight = height / 1.618;
    lineHeight = pyramidHeight / 19;
    fontSize = lineHeight * 0.95;
    pyramidTop = height - pyramidHeight + lineHeight / 2;
  } else {
    actualWidth = width / 2;
    marginLeft = 0;
    pyramidCenter = actualWidth / 2;
    pyramidHeight = 200;
    lineHeight = pyramidHeight / 19;
    fontSize = lineHeight;
    pyramidTop = lineHeight / 2;
    scl *= 0.666;
  }
  
  textFont(font);
  textAlign(CENTER, CENTER);
  textSize(fontSize); // Adjust text size based on screen size
  fill(0);

  for (let i = 0; i < objects.length; i++) {
    objects[i].img.filter(GRAY);
    if (objects[i].isBlendie) {
      objects[i].img.filter(BLUR, 1);
    }
  }

  resetLayout();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  scl = min(width, height) / 100;
  if (windowWidth >= windowHeight) {
    actualWidth = width / 1.618;
    marginLeft = width - actualWidth;
    pyramidCenter = marginLeft + actualWidth / 2;
    pyramidHeight = height / 1.618;
    lineHeight = pyramidHeight / 19;
    fontSize = lineHeight * 0.95;
    pyramidTop = height - pyramidHeight + lineHeight / 2;
  } else {
    actualWidth = width / 2;
    marginLeft = 0;
    pyramidCenter = actualWidth / 2;
    pyramidHeight = 200;
    lineHeight = pyramidHeight / 19;
    fontSize = lineHeight;
    pyramidTop = lineHeight / 2;
    scl *= 0.666;
  }
  
  resetLayout();
}

function isOverlapping(x1, y1, w1, h1, obj) {
  let x2 = obj.x;
  let y2 = obj.y;
  let w2 = obj.w;
  let h2 = obj.h;

  return !(x1 + w1 < x2 || x1 > x2 + w2 || y1 + h1 < y2 || y1 > y2 + h2);
}

function checkPositionRelativeToLine(px, py, x1, y1, x2, y2) {
  // Calculate the cross product of vectors
  return (x2 - x1) * (py - y1) - (y2 - y1) * (px - x1);
}

function moveObjects() {
  for (let i = 0; i < objects.length; i++) {
    let obj = objects[i];
    obj.x += obj.v.x;
    obj.y += obj.v.y;
  
    if (obj.x < marginLeft || obj.x + obj.w > width) {
      obj.v.x = -obj.v.x;
      obj.x += obj.v.x;
    }

    if (obj.y + obj.h < 0) {
      obj.v.y = -obj.v.y;
      obj.y += obj.v.y;
    }

    if (obj.y > height + obj.h) {
      obj.y = -obj.h;
    }
  }
}

function reflectVelocity(ball, p1, p2) {
  // Line vector
  let lineVec = p5.Vector.sub(p2, p1);
  
  
}

function checkIntersections() {

  for (let i = 0; i < objects.length; i++) {
    let x = objects[i].x;
    let y = objects[i].y;
    let h = objects[i].h;
    
    if (x > pyramidCenter && y < height - pyramidHeight / 2 && checkPositionRelativeToLine(x, y+h, rightLineX1, rightLineY1, rightLineX2, rightLineY2) >= 0) {
      // Normal to the line
      let normalVec = createVector(rightLineY2 - rightLineY1, rightLineX1 - rightLineX2).normalize();  // Perpendicular to the line
      
      // Reflection formula: V' = V - 2 * (V dot N) * N
      let dotProduct = objects[i].v.dot(normalVec);
      let reflection = p5.Vector.sub(objects[i].v, p5.Vector.mult(normalVec, 2 * dotProduct));

      // Update the ball's velocity
      objects[i].v.set(reflection);
    } else if (x < pyramidCenter && y < height - pyramidHeight / 2 && checkPositionRelativeToLine(x, y+h, leftLineX1, leftLineY1, leftLineX2, leftLineY2) < 0) {
      // Normal to the line
      let normalVec = createVector(leftLineY2 - leftLineY1, leftLineX1 - leftLineX2).normalize();  // Perpendicular to the line
      
      // Reflection formula: V' = V - 2 * (V dot N) * N
      let dotProduct = objects[i].v.dot(normalVec);
      let reflection = p5.Vector.sub(objects[i].v, p5.Vector.mult(normalVec, 2 * dotProduct));

      // Update the ball's velocity
      objects[i].v.set(reflection);
    }
  }

  for (let i = 0; i < objects.length - 1; i++) {
    for (let j = i + 1; j < objects.length; j++) {
      if (isOverlapping(objects[i].x, objects[i].y, objects[i].w, objects[i].h, objects[j])) {
        let o1 = objects[i];
        let o2 = objects[j];

        let collisionNormal = p5.Vector.sub(createVector(o2.x, o2.y), createVector(o1.x,o1.y));
        collisionNormal.normalize();
        
        // Tangent vector
        let collisionTangent = createVector(-collisionNormal.y, collisionNormal.x);
        
        // Project velocities onto the normal and tangent
        let v1n = collisionNormal.dot(o1.v);
        let v1t = collisionTangent.dot(o1.v);
        let v2n = collisionNormal.dot(o2.v);
        let v2t = collisionTangent.dot(o2.v);
        
        // Calculate new normal velocities (elastic collision)
        let v1nFinal = (v1n * (o1.mass - o2.mass) + 2 * o2.mass * v2n) / (o1.mass + o2.mass);
        let v2nFinal = (v2n * (o2.mass - o1.mass) + 2 * o1.mass * v1n) / (o1.mass + o2.mass);
        
        // Convert scalar normal and tangential velocities into vectors
        let v1nVec = p5.Vector.mult(collisionNormal, v1nFinal);
        let v1tVec = p5.Vector.mult(collisionTangent, v1t);
        let v2nVec = p5.Vector.mult(collisionNormal, v2nFinal);
        let v2tVec = p5.Vector.mult(collisionTangent, v2t);
        
        // Update velocities by adding normal and tangential components
        o1.v = p5.Vector.add(v1nVec, v1tVec);
        o2.v = p5.Vector.add(v2nVec, v2tVec);

      }
    }
  }

}

function findXY(i, w, h) {
  let x = 0;
  let y = 0;

  let allGood = false;
  let count = 0;
  while (!allGood && count < 10000) {
    count += 1;
    x = random(pyramidCenter - fontSize * 12,pyramidCenter + fontSize * 12);
    y = random(0, lineHeight * 3);

    allGood = true;

    for (let j = 0; j < objects.length; j++) {
      if (i == j) continue;

      if (isOverlapping(x, y, w, h, objects[j])) {
        allGood = false;
      }
    }
  }

  return [x, y];
}

function resetLayout() {
  for (let i = 0; i < objects.length; i++) {
    let maxWH = max(objects[i].img.width , objects[i].img.height );
    let scale = scl * 10 * objects[i].randomScale;

    objects[i].w = objects[i].img.width / maxWH * scale;
    objects[i].h = objects[i].img.height / maxWH * scale;

    let xy = findXY(i, objects[i].w, objects[i].h);
    objects[i].x = xy[0];
    objects[i].y = xy[1];
  }
}

function touchStarted() {
  return false;
}

function draw() {
  clear();

  if (keyIsDown(RIGHT_ARROW)) {
    pyramidCenter += 1;
  } else if (keyIsDown(LEFT_ARROW)) {
    pyramidCenter -= 1;
  }

  
  t += 1;

  rightLineX1 = pyramidCenter - fontSize*8;
  rightLineY1 = height;
  rightLineX2 = pyramidCenter + fontSize * 10;
  rightLineY2 = height - pyramidHeight + lineHeight / 2;

  leftLineX1 = pyramidCenter + fontSize*6.5;
  leftLineY1 = height;
  leftLineX2 = pyramidCenter - fontSize * 11.5;
  leftLineY2 = height - pyramidHeight + lineHeight / 2;


  // stroke('magenta');
  // strokeWeight(3);
  // line(rightLineX1, rightLineY1, rightLineX2, rightLineY2);
  // line(leftLineX1, leftLineY1, leftLineX2, leftLineY2);
  // stroke(0);

  moveObjects();
  checkIntersections();

  for (let i = 0; i < objects.length; i++) {

    if (!objects[i].isBlendie) {
      push();  // Save the current transformation matrix
      translate(objects[i].x + objects[i].w / 2, objects[i].y + objects[i].h / 2);
      rotate(t / 100);

      // Display the image
      image(objects[i].img, 0, 0, objects[i].w, objects[i].h);  // Adjust size if needed
      pop();   // Restore the original transformation matrix

      //image(objects[i].img, objects[i].x, objects[i].y, objects[i].w, objects[i].h);
    } else {
      // Blendie
      if (millis() - lastBlendTime > intervalBlend) {
        blending = true;
      }
      if (millis() - lastBlendTime > intervalBlend + blendTime) {
        blending = false;
        lastBlendTime = millis();
        intervalBlend = random(1000, 3000);
      }

      let noise = blending ? sin(t*10000) * scl * 0.6 : 0;
      image(objects[i].img, objects[i].x + noise, objects[i].y, objects[i].w, objects[i].h);
    }
  }

  // Text animation
  textFont(font);
  textAlign(CENTER);
  textSize(fontSize);

  // change this on mobile
  let x = pyramidCenter;
  let yStart = pyramidTop; 

  if (!animate && millis() - lastStartTime > intervalLong) {
    lastStartTime = millis();
    animate = true;
    shiftDir = random([-1, 1]);
    bottomShiftDir = random([-1, 1]);
    intervalLong = Math.pow(random(13, 64), 2);
    intervalShort = random(30, 90);
  }

  if (animate && millis() - lastShiftTime > intervalShort) {
    xOffset += 3 * shiftDir;
    xOffsetBottom += 3 * bottomShiftDir;
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
}

function drawTextPyramid(x, yStart, lineHeight) {
  // Top triangle
  for (let i = word.length; i > 9; i -= 3) {
    fill(i == word.length ? 0 : 69);
    let currentLine = word.substring(0, i);
    let shiftedLine = currentLine.slice(-xOffset) + currentLine.slice(0, -xOffset);
    text(shiftedLine, x, yStart);
    yStart += lineHeight;
  }

  // Middle
  let currentLine = word.substring(0, 9);
  let shiftedLine = currentLine.slice(-xOffset) + currentLine.slice(0, -xOffset);
  text(shiftedLine, x, yStart);
  yStart += lineHeight;

  // Bottom triangle
  for (let i = 12; i <= word.length; i += 3) {
    fill(i == word.length ? 0 : 69);
    let currentLine = word.substring(0, i);
    let shiftedLine = currentLine.slice(-xOffsetBottom) + currentLine.slice(0, -xOffsetBottom);
    text(shiftedLine, x, yStart);
    yStart += lineHeight;
  }
}