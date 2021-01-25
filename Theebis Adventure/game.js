const levels = [ 
	// level 0
	["bomb", "wall", "", "", "",
	"laserh", "wall", "", "", "defuser",
	"", "totem", "animate", "animate", "animate",
	"", "swamp", "", "", "",
	"", "laserv", "", "theebisu", ""],
	
	// level 1
	["bomb", "swamp", "", "", "",
	"laserh", "swamp", "", "", "defuser",
	"animate", "bridge animate", "animate", "animate", "animate",
	"", "swamp", "", "", "",
	"", "water", "theebisu", "", ""],
	
	// level 2
	["totem", "totem", "bomb", "totem", "totem",
	"animate", "animate", "animate", "animate", "animate",
	"swamp", "bridge", "swamp", "swamp", "swamp",
	"", "", "", "laserh", "",
	"defuser", "wall", "", "", "theebisu"]
  ]; // end of levels

const gridBoxes = document.querySelectorAll("#gameBoard div");
var currentLevel = 0; // starting level
var defuserOn = false // is the defuser on?
var currentLocationOfTheebis = 0;
var currentAnimation; // allows 1 animation per level

// start game
window.addEventListener("load", function() {
	loadLevel();
});

// load levels 0 - maxlevel
function loadLevel(){
	let levelMap = levels[currentLevel];
	let animateBoxes;
	defuserOn = false;
	
	//load board
	for (i = 0; i<gridBoxes.length; i++) {
		gridBoxes[i].className = levelMap[i];
		if (levelMap[i].includes("theebis")) currentLocationOfTheebis = i;
	} // for
	
	animateBoxes = document.querySelectorAll(".animate");
	
	animateEnemy(animateBoxes, 0, "right");
	
} // loadlevel

// animate enemy left to right 
function animateEnemy(boxes, index, direction) {
	//exit function if no animation
	if (boxes.length <= 0) { return; }
	
	// update images
	if (direction == "right") {
		boxes[index].classList.add("enemyr");
	} else {
		boxes[index].classList.add("enemyl");
	}
	
	// remove images from other boxes
	for (i = 0; i < boxes.length; i++) {
		if (i != index) {
			boxes[i].classList.remove("enemyl");
			boxes[i].classList.remove("enemyr");
		}
	} // for
	
	// moving right
	if (direction == "right") {
		// turn around if hit right side
		if (index == boxes.length - 1) {
			index--;
			direction = "left"
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
	}, 750);
} // animateEnemy
