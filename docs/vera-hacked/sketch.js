let parts = [

'L A B R A C A D A B R A . L A B R A C A D A B R A',
'L A B R A C A D A B R A . L A B R A C A D A B R',
'L A B R A C A D A B R A . L A B R A C A D A B',
'L A B R A C A D A B R A . L A B R A C A D A',
'L A B R A C A D A B R A . L A B R A C A D',
'L A B R A C A D A B R A . L A B R A C A',
'L A B R A C A D A B R A . L A B R A C',
'L A B R A C A D A B R A . L A B R A',
'L A B R A C A D A B R A . L A B R',
'L A B R A C A D A B R A . L A B',
'L A B R A C A D A B R A . L A',
'L A B R A C A D A B R A . L',
'L A B R A C A D A B R A .',
'L A B R A C A D A B R A',
'L A B R A C A D A B R',
'L A B R A C A D A B',
'L A B R A C A D A',
'L A B R A C A D',
'L A B R A C A',
'L A B R A C',
'L A B R A',
'L A B R',
'L A B',
'L A',
'L',
'L A',
'L A B',
'L A B R',
'L A B R A',
'L A B R A C',
'L A B R A C A',
'L A B R A C A D',
'L A B R A C A D A',
'L A B R A C A D A B',
'L A B R A C A D A B R',
'L A B R A C A D A B R A',
'L A B R A C A D A B R A .',
'L A B R A C A D A B R A . L',
'L A B R A C A D A B R A . L A',
'L A B R A C A D A B R A . L A B',
'L A B R A C A D A B R A . L A B R',
'L A B R A C A D A B R A . L A B R A',
'L A B R A C A D A B R A . L A B R A C',
'L A B R A C A D A B R A . L A B R A C A',
'L A B R A C A D A B R A . L A B R A C A D',
'L A B R A C A D A B R A . L A B R A C A D A',
'L A B R A C A D A B R A . L A B R A C A D A B',
'L A B R A C A D A B R A . L A B R A C A D A B R',
'L A B R A C A D A B R A . L A B R A C A D A B R A',
'L A B R A C A D A B R A . L A B R A C A D A B R A .',
'L A B R A C A D A B R A . L A B R A C A D A B R A . L',
'L A B R A C A D A B R A . L A B R A C A D A B R A . L A',
'L A B R A C A D A B R A . L A B R A C A D A B R A . L A B',
'L A B R A C A D A B R A . L A B R A C A D A B R A . L A B R',
'L A B R A C A D A B R A . L A B R A C A D A B R A . L A B R A',
'L A B R A C A D A B R A . L A B R A C A D A B R A . L A B R A C',
'L A B R A C A D A B R A . L A B R A C A D A B R A . L A B R A C A',
'L A B R A C A D A B R A . L A B R A C A D A B R A . L A B R A C A D',
'L A B R A C A D A B R A . L A B R A C A D A B R A . L A B R A C A D A',
'L A B R A C A D A B R A . L A B R A C A D A B R A . L A B R A C A D A B',
'L A B R A C A D A B R A . L A B R A C A D A B R A . L A B R A C A D A B R',
'L A B R A C A D A B R A . L A B R A C A D A B R A . L A B R A C A D A B R A',
]
let threshold = 50
let rows = 24
let margin = 20
let repeat = 50
let scl = 10
let debug = false

let h, w
let font 
let offset
let pg
let boxes = []
let totalTextWidth = 0
let totalWord = ""
let bgC = 255
let bgCol
let boxStarted, startX, endX, startC
let lineToShow = 0
let fillColor = 255
let increment = 0
let bottomSpace = 60
let chindoguTop, chindoguBottom	

function preload() {
	font = loadFont("Atlas Typewriter.otf")
	chindoguTop = loadImage("chindogu-top.png")
	chindoguBottom = loadImage("chindogu-bottom.png")
}

function setup() {
	createCanvas(1920, 1080);
	h = (height-margin*2-bottomSpace)/rows
	w = (width-margin*2)/rows
	pg = createGraphics( int(width/scl), int(height/scl), WEBGL)
	bgCol = color(bgC)
	startC = color(0)

	chindoguTop.filter(GRAY)
	chindoguBottom.filter(GRAY)

	noStroke()
	textFont(font)
	textSize(40)
	textAlign(LEFT, TOP)
	for(let i = 0; i < parts.length; i++) {
		totalTextWidth += textWidth(parts[i])
		totalWord += parts[i] + " "
	}
}

function draw() {
	background(220);

	// threshold = int(map(mouseX, 0, width, 1, 50))
	// console.log(threshold)
	updateGraphics()

	drawPoster()
	repeat = 5 + sin(millis()/1000)*5
	increment++
	showDebug()
	textAlign(LEFT, BOTTOM)
	text('LABRACADABRA: THE UNTOLD HISTORY OF THE FUTURE        OCTOBER 15–18, 2024     HACKATHON + EXHIBITION', margin, height-margin)
}

function showDebug() {
	if(debug) {
		image(pg, 0 , 0)
		// fill(0)
		// rectMode(CORNER)
		// rect(width-textWidth("00")-margin, margin, textWidth("00"), 40)
		// fill(255)
		textAlign(RIGHT)
		text(int(frameRate()), width-margin, 30)	
	}
}


function drawPoster() {
	boxes = []
	let currentRow = 0
	let totalBoxes = 0
	for(let y = 0; y < rows; y++) {
		// boxes[y] = []
		boxStarted = false
	 	for(let x = 0; x < rows; x++) {
			let c = pg.get( int( (x*w+w/2+margin)/scl), int( (y*h+h/2 + margin)/scl) )
			
			if(x == 0) {
				console.log(0)
				boxStarted = true
				startX = x*w+margin
				startC = c
			}

			// 	// If box has started, check if the color is different enough
			if(
				red(c) >= (red(startC)+threshold) || red(c) <= (red(startC)-threshold) || 
				green(c) >= (green(startC)+threshold) || green(c) <= (green(startC)-threshold) ||
				blue(c) >= (blue(startC)+threshold) || blue(c) <= (blue(startC)-threshold) ){
				if(boxStarted == true  ) {
					boxStarted = false
					endX = (x)*w+margin
					boxes.push([startX, y*h+margin, endX-startX, startC, currentRow])
				}
			
				// If box has not started, start a new box
				if(!boxStarted ) {
					boxStarted = true
					startX = x*w+margin
					startC = c
				} 
			}

			if(x == rows-1) {
				boxStarted = false
				endX = (x+1)*w+margin
				boxes.push([startX, y*h+margin, endX-startX, startC, currentRow])
			}
	 	}

		// if some boxes were made on this line, move up
		if(totalBoxes != boxes.length) {
			currentRow++ 
			totalBoxes = boxes.length
		}
	}

	fill(50)

	// Display boxes
	let index = 0;
	let lastY = 0
	for(let i = 0; i < boxes.length; i++) {
		if(lastY != boxes[i][4]) {
			index = 0
			lastY = boxes[i][4]
		}
		fill(boxes[i][3] )
		rectMode(CORNER, TOP)
		// if(brightness(boxes[i][3]) < 50) {
		// 	rect(boxes[i][0], boxes[i][1], boxes[i][2] , h)
		// }
		// let b = int(map(brightness(boxes[i][3]), 0, 100, floor(boxes[i][2]/textWidth("a")) , 2))
		let b = parts[ (boxes[i][4]+increment)%parts.length].length
		if(lineToShow > 1 ) {
			b = parts[lineToShow].length
		}
		b = constrain(b, 0, ceil( (boxes[i][2]-textWidth("i"))/15) )
		// let bparts[i%parts.length].length
		// int(map(brightness(boxes[i][3]), 0, 100, ceil(boxes[i][2]/textWidth("a")) , 2))
		let ww = (boxes[i][2]-textWidth("i"))/(b-1)
		textAlign(CENTER, CENTER)
		rectMode(CENTER, CENTER)

		for(let j = 0; j < b; j++) {
			
				let word = parts[ (boxes[i][4]+increment) %parts.length]
				let c = word.charAt(index%(word.length+1) )
				index++

				if( red(boxes[i][3]) !== 255 && green(boxes[i][3]) !== 255 ) {
					fill(boxes[i][3])
					// rect(ww*j+boxes[i][0] + textWidth("i")*0.5, boxes[i][1]+h/2, textWidth("i"), h-5)
					fill(50)
				} else {
					fill(50)
					text(c, ww * j + boxes[i][0] + textWidth("i")*0.5, boxes[i][1] + h/2)
				}
				
			
			// text(totalWord, boxes[i][0]+margin, boxes[i][1]+margin)
		}
		
	}
	if(frameCount%120 == 3) {
		fillColor = 0
	}

	
	
	
}

function keyPressed() {
	if(key == 's' || key == 'S') {
		save("Vera.png")
	}
	if(key == 'f' || key == 'F') {
		
	}
}

let pgW  = 0
function updateGraphics() {
	pgW  = pg.width*0.056
	pg.push()
	pg.background(255)
	// pg.translate(0, 0, -100)
	pg.filter(THRESHOLD, 0.1)
	pg.image(chindoguTop, -pg.width/2, -pg.height/2+10, pg.height/3, pg.height/3)
	pg.image(chindoguBottom, 23, 0, pg.width/2, pg.width/2)
	// pg.translate(0, 0, 100)

	tint(255, 175)
	image(chindoguTop, 0, 10*scl, height/3, height/3)
	image(chindoguBottom, width/2+23*scl, height/2, width/2, width/2)
	noTint()

	pg.fill(125, 0, 255)
	pg.noStroke()
	pg.normalMaterial();

	// L
	pg.translate(pgW, pgW, 0)

	pg.translate(-pgW*3, pgW*2, 0)
	pg.box(pgW*3, pgW )
	pg.translate(-pgW*1, -pgW*1, 0)
	pg.box(pgW, pgW*3, pgW )

	// M
	pg.translate(pgW*4, -pgW*2, 0)
	pg.translate(-pgW*2.5, -pgW*3, 0)
	pg.box(pgW*4, pgW, pgW )
	pg.translate(pgW*2.5, pgW*3, 0)

	pg.box(pgW*3, pgW )
	pg.translate(-pgW*1, -pgW*1, 0)
	pg.box(pgW, pgW*3, pgW )
	pg.translate(pgW*3, pgW*2.5, 0)

	pg.box(pgW, pgW*4, pgW )

	// pg.ellipsoid(pg.width*0.75,  pg.width/5,  pg.width*0.3);

	pg.pop()
}
