const levels = [ 
	// level 0
	["bomb", "swamp", "defuser", "", "",
	"laserh", "swamp", "totem", "totem", "",
	"animate", "bridge animate", "animate", "laserv animate", "animate",
	"swamp", "swamp", "", "wall", "",
	"", "", "", "wall", "theebisup"],
	
	// level 1
	["", "", "laserv", "bomb", "swamp",
	"", "wall", "swamp", "swamp", "",
	"laserh", "totem", "animate", "animate", "defuser animate",
	"", "swamp", "wall", "", "totem",
	"", "", "laserv", "", "theebisup"],
	
	// level 2
	["animate", "defuser animate", "wall", "bomb", "totem",
	"totem", "", "totem", "", "",
	"", "", "swamp", "swamp", "laserh",
	"", "totem", "", "", "",
	"", "", "", "totem", "theebisup"],
	
	// level 3
	["animate", "", "", "", "",
	"animate", "", "swamp", "swamp", "",
	"animate", "swamp", "defuser", "", "",
	"animate", "", "swamp", "swamp", "swamp",
	"animate", "", "", "theebisup", "bomb"]
	
  ]; // end of levels

const gridBoxes = document.querySelectorAll("#gameBoard div");
const noPassObstacles = ["wall", "totem", "swamp"];

var currentLevel = 0; // starting level
var defuserOn = false; // is the defuser on?
var currentLocationOfTheebis = 0;
var currentAnimation; // allows 1 animation per level
var widthOfBoard = 5;
var enemySpeed = 0;

// start game
window.addEventListener("load", function() {
	loadLevel();
});

//move horse
document.addEventListener("keydown", function (e) {
	switch (e.keyCode) {
		case 37: // left arrow
			if (currentLocationOfTheebis % widthOfBoard !== 0) {
				tryToMove("left");
			}
			break;
		case 38: // up arrow
			if (currentLocationOfTheebis - widthOfBoard >= 0) {
				tryToMove("up");
			}
			break;
		case 39: // right arrow
			if (currentLocationOfTheebis % widthOfBoard < widthOfBoard - 1) {
				tryToMove("right");
			}
			break;
		case 40: // down arrow
			if (currentLocationOfTheebis + widthOfBoard < widthOfBoard * widthOfBoard) {
				tryToMove("down");
			}
			break;
	}
});

// try to move horse
function tryToMove(direction) {
	
	// location before move
	let oldLocation = currentLocationOfTheebis;
	
	// class of location before move
	let oldClassName = gridBoxes[oldLocation].className;
	
	let nextLocation = 0; // location we wish to move to
	let nextClass = "";   // class of location we wish to move to
	
	let nextLocation2 = 0; 
	let nextClass2 = "";   
	
	let newClass = ""; // new class to switch to if move successful
	
	switch(direction){
		case "left":
			nextLocation = currentLocationOfTheebis - 1;
			break;
		case "up":
			nextLocation = currentLocationOfTheebis - widthOfBoard;
			break;
		case "right":
			nextLocation = currentLocationOfTheebis + 1;
			break;
		case "down":
			nextLocation = currentLocationOfTheebis + widthOfBoard;
			break;
	} // switch

	nextClass = gridBoxes[nextLocation].className;
	
	// if the obstacle is not passable, don't move
	if (noPassObstacles.includes(nextClass)){ return; }
	
	// if the next space had a bomb and the defuser isn't on, don't move
	if (!defuserOn && nextClass.includes("bomb")){ return; }
	
	// if it's a laser, and there is no defuser, don't move
	if (!defuserOn && nextClass.includes("laser")){ return; }
	
	// if there is a laser, move two spaces with animation
	if (nextClass.includes("laser")) {
		
		// rider must be on to jump
		if (defuserOn) {
			gridBoxes[currentLocationOfTheebis].className = "";
			oldClassName = gridBoxes[nextLocation].className;
			
			// set values according to direction
			if (direction == "left") {
				nextClass = "laserpassleft";
				nextClass2 = "theebisdefuserleft";
				nextLocation2 = nextLocation - 1;
			} else if (direction == "right") {
				nextClass = "laserpassright";
				nextClass2 = "theebisdefuserright";
				nextLocation2 = nextLocation + 1;
			} else if (direction == "up") {
				nextClass = "laserpassup";
				nextClass2 = "theebisdefuserup";
				nextLocation2 = nextLocation - widthOfBoard;
			} else if (direction == "down") {
				nextClass = "laserpassdown";
				nextClass2 = "theebisdefuserdown";
				nextLocation2 = nextLocation + widthOfBoard;
			}
			
			// show Theebis jumping laser
			gridBoxes[nextLocation].className = nextClass;
			
			setTimeout(function() {
				
				// set jump back to just laser
				gridBoxes[nextLocation].className = oldClassName;
				
				// update current location of Theebis to be 2 spaces past take off
				currentLocationOfTheebis = nextLocation2;
				
				// get class of box after jump
				nextClass = gridBoxes[currentLocationOfTheebis].className;
				
				// show theebis and defuser after landing
				gridBoxes[currentLocationOfTheebis].className = nextClass2;
				
				// if next box is a bomb, go up a level
				levelUp(nextClass);
				
			}, 350);
			return;
			
		}
	}
	
	// if there is a defuser, add defuser
	if (nextClass.includes("defuser")) {
		defuserOn = true;
	}
	
	// if there is a bridge in the old location, keep it
	if (oldClassName.includes("bridge")) {
		gridBoxes[oldLocation].className = "bridge";
	} else {
		gridBoxes[oldLocation].className = "";
	}
	
	// build name of new class
	newClass = (defuserOn) ? "theebisdefuser" : "theebis";
	newClass += direction;
	
	// if there is a bridge in the next location, keep it
	if (gridBoxes[nextLocation].classList.contains("bridge")) {
		newClass += " bridge";
	}
	
	// move 1 spaces
	currentLocationOfTheebis = nextLocation;
	gridBoxes[currentLocationOfTheebis].className = newClass;
	
	// if it is an enemy, end the game
	if (nextClass.includes("enemy")) {
		document.getElementById("lose").style.display = "block";
		return;
	}
	
	// move up to next level if needed
	levelUp(nextClass);

} // tryToMove

function levelUp(nextClass) {
	if (nextClass == "bomb" && defuserOn) {
		if (currentLevel <= 2) {
			document.getElementById("levelup").style.display = "block";
		} else {
			document.getElementById("win").style.display = "block";
		}
		clearTimeout(currentAnimation);
		setTimeout (function(){
			document.getElementById("levelup").style.display = "none";
			if (currentLevel <= 2) {
				currentLevel++;
				loadLevel();
			}
		}, 1000);
	}
}

// load levels 0 - maxlevel
function loadLevel(){
	enemySpeed = 650 - (currentLevel * 125)
	let levelMap = levels[currentLevel];
	let animateBoxes;
	defuserOn = false;
	
	//load board
	for (i = 0; i < gridBoxes.length; i++) {
		gridBoxes[i].className = levelMap[i];
		if (levelMap[i].includes("theebis")) currentLocationOfTheebis = i;
	} // for
	
	animateBoxes = document.querySelectorAll(".animate");
	
	animateEnemy(animateBoxes, 0, "right");
	
} // loadlevel

// animate enemy left to right 
function animateEnemy(boxes, index, direction) {
	// exit function if no animation
	if (boxes.length <= 0) { return; }
	
	// update images
	if (direction == "right") {
		boxes[index].classList.add("enemyright");
	} else {
		boxes[index].classList.add("enemyleft");
	}
	
	// remove images from other boxes
	for (i = 0; i < boxes.length; i++) {
		if (i != index) {
			boxes[i].classList.remove("enemyleft");
			boxes[i].classList.remove("enemyright");
		}
	} // for
	
	// moving right
	if (direction == "right") {
		// turn around if hit right side
		if (index == boxes.length - 1) {
			index--;
			direction = "left";
		} else {
			index++;
		}
	
	// moving left
	} else {
		// turn around if hit left side
		if (index == 0) {
			index++;
			direction = "right";
		} else {
			index--;
		} 
	} // else
		
	currentAnimation = setTimeout(function() {
		animateEnemy(boxes, index, direction);
	}, enemySpeed);
} // animateEnemy
