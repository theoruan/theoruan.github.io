
var speedOfPaddle1 = 0;
var speedOfPaddle2 = 0;
const startPositionOfPaddle1 = document.getElementById("paddle1").offsetTop;
const startPositionOfPaddle2 = document.getElementById("paddle2").offsetTop;
var positionOfPaddle1 = document.getElementById("paddle1").offsetTop;
var positionOfPaddle2 = document.getElementById("paddle2").offsetTop;

const paddleHeight = document.getElementById("paddle1").offsetHeight;
const paddleWidth = document.getElementById("paddle1").offsetWidth;

const gameboardHeight = document.getElementById("gameBoard").offsetHeight;
const gameboardWidth = document.getElementById("gameBoard").offsetWidth;
const ballHeight = document.getElementById("ball").offsetHeight;

const startTopPositionOfBall = document.getElementById("ball").offsetTop;
const startLeftPositionOfBall = document.getElementById("ball").offsetTop;

var topPositionOfBall = startTopPositionOfBall;
var leftPositionOfBall = startLeftPositionOfBall;
var topSpeedOfBall = 0;
var leftSpeedOfBall = 0;

var finalScore = 0;

var score1 = 0;
var score2 = 0;

var ballSpeed = 90;

var whip = new sound("whip.mp3");
var bruh = new sound("bruh.mp3");

var controlPlay;

/*
window.addEventListener('load', function () {
	startBall();
});
*/

function set10() {
	finalScore = 10;
	showLightBox("You are playing to 10", "Press 'Start Game' to begin!!");
}

function set15() {
	finalScore = 15;
	showLightBox("You are playing to 15", "Press 'Start Game' to begin!!");
}

function set20() {
	finalScore = 20;
	showLightBox("You are playing to 20", "Press 'Start Game' to begin!!");
}

document.addEventListener('keydown', function(e) {
	console.log("key down " + e.keyCode);
	if(e.keyCode == 87 || e.which == 87) {
		speedOfPaddle1 = -10;
	}
	if(e.keyCode == 83 || e.which == 83) {
		speedOfPaddle1 = 10;
	}
	if(e.keyCode == 38 || e.which == 38) {
		speedOfPaddle2 = -10;
	}
	if(e.keyCode == 40 || e.which == 40) {
		speedOfPaddle2 = 10;
	}
	
});

document.addEventListener('keyup', function(e) {
	console.log("key up " + e.keyCode);
	if(e.keyCode == 87 || e.which == 87) {
		speedOfPaddle1 = 0;
	}
	if(e.keyCode == 83 || e.which == 83) {
		speedOfPaddle1 = 0;
	}
	if(e.keyCode == 38 || e.which == 38) {
		speedOfPaddle2 = 0;
	}
	if(e.keyCode == 40 || e.which == 40) {
		speedOfPaddle2 = 0;
	}
});

// https://www.w3schools.com/graphics/game_sound.asp
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}

function startBall() {
		let direction = 1;
		topPositionOfBall = startTopPositionOfBall;
		leftPositionOfBall = startLeftPositionOfBall;
	
		if (Math.random() < 0.5) {
			direction = 1;
		} else {
			direction = -1;
		}
		topSpeedOfBall = Math.random() * 2 + 3;
		leftSpeedOfBall = direction * (Math.random() * 2 + 3);
}

function show() {
	
	positionOfPaddle1 += speedOfPaddle1;
	positionOfPaddle2 += speedOfPaddle2;
	topPositionOfBall += topSpeedOfBall;
	leftPositionOfBall += leftSpeedOfBall;
	
	if (positionOfPaddle1 <= 0) {
		positionOfPaddle1 = 0;
	}
	if (positionOfPaddle2 <= 0) {
		positionOfPaddle2 = 0;
	}
	
	if (positionOfPaddle1 >= gameboardHeight - paddleHeight) {
		positionOfPaddle1 = gameboardHeight - paddleHeight;
	}
	if (positionOfPaddle2 >= gameboardHeight - paddleHeight) {
		positionOfPaddle2 = gameboardHeight - paddleHeight;
	}
	
	if (topPositionOfBall <= 0 || topPositionOfBall >= gameboardHeight - ballHeight) {
		topSpeedOfBall *= -1;
	}
	
	if (leftPositionOfBall <= paddleWidth) {
		if (topPositionOfBall > positionOfPaddle1 && topPositionOfBall < positionOfPaddle1 + paddleHeight) {
			whip.play();
			leftSpeedOfBall *= -1;
		} else {
			bruh.play();
			score2 ++;
			if (finalScore != 0 && score2 >= finalScore) {
				ballSpeed = 0;
				stopGame();
			}
			updateBallSpeed();
			document.getElementById("score2").innerHTML = score2;
			startBall();
		}
	}
	if (leftPositionOfBall >= gameboardWidth - paddleWidth - ballHeight) {
		if (topPositionOfBall > positionOfPaddle2 && topPositionOfBall < positionOfPaddle2 + paddleHeight) {
			whip.play();
			leftSpeedOfBall *= -1;
		} else {
			bruh.play();
			score1 ++;
			if (finalScore != 0 && score1 >= finalScore) {
				ballSpeed = 0;
				stopGame();
			}
			updateBallSpeed();
			document.getElementById("score1").innerHTML = score1;
			startBall();
		}
	}
	
	document.getElementById("paddle1").style.top = positionOfPaddle1 + "px";
	document.getElementById("paddle2").style.top = positionOfPaddle2 + "px";
	document.getElementById("ball").style.top = topPositionOfBall + "px";
	document.getElementById("ball").style.left = leftPositionOfBall + "px";
	
}

function updateBallSpeed () {
	ballSpeed += 4;
	window.clearInterval(controlPlay);
	controlPlay = false;
	if(!controlPlay) {
		controlPlay = window.setInterval(show, 1000/ballSpeed);
	}
}

function resumeGame() {
	if(!controlPlay) {
		controlPlay = window.setInterval(show, 1000/ballSpeed);
	}
}

function pauseGame() {
	window.clearInterval(controlPlay);
	controlPlay = false;
}

function startGame() {
	score1 = 0;
	score2 = 0;
	document.getElementById("score1").innerHTML = score1;
	document.getElementById("score2").innerHTML = score2;
	
	startBall();
	positionOfPaddle1 = startPositionOfPaddle1;
	positionOfPaddle2 = startPositionOfPaddle2;
	
	if(!controlPlay) {
		controlPlay = window.setInterval(show, 1000/ballSpeed);
	}
}

function stopGame() {
	window.clearInterval(controlPlay);
	controlPlay = false;
	
	let message1 = "Tie Game";
	let message2 = "Press 'Start Game' to play again";
	
	if (score2 > score1) {
		message1 = "Player 2 takes the W with " + score2 + " points!!";
		message2 = "Player 1 had " + score1 + " points. Press 'Start Game' to play again";
	} else if (score1 > score2) {
		message1 = "Player 1 takes the W with " + score1 + " points!!";
		message2 = "Player 2 had " + score2 + " points. Press 'Start Game' to play again";
	}
	
	showLightBox(message1, message2);
}

function changeVisibility (divId){
	
	let elem = document.getElementById(divId);
	
	if (elem) {
		elem.className = (elem.className == 'hide') ? 'show' : 'hide';
	}
}

function showLightBox (message, message2) {
	
	
	document.getElementById("message").innerHTML = message;
	document.getElementById("message2").innerHTML = message2;
	
	changeVisibility("lightbox");
	changeVisibility("boundaryMessage");
	
}

function continueGame() {
	changeVisibility("lightbox");
	changeVisibility("boundaryMessage"); 
}