function Flappy(width, height) {
	
	this.width = width;
	this.height = height;
	this.score = 0;
	this.lastStep = Date.now();
	this.highscore = 0;

	// Canvas
	var canvas = this.canvas = document.createElement('canvas');
	canvas.width = this.width;
	canvas.height = this.height;
	canvas.style.background = '#333';
	
	// Context
	var context = this.context = canvas.getContext('2d');
	context.fillStyle = 'white';
	context.strokeStyle = 'white';
	context.lineWidth = '1';
	context.textAlign = 'left';
	context.textBaseline = 'top';
	context.font = '14px Menlo, monospace';

	// Bird
	var location = new Vector(width / 2, height * 0.4);
	var velocity = new Vector(width / 150, 0);
	var radius = width / 50;
	var gravity = new Vector(0, height / 2000);
	var bird = this.bird = new Bird(location, velocity, radius, gravity, this);

	// Barriers
	var barrierWidth = width / 50;
	var barrierHeight = height / 3;
	var leftBarrier = this.leftBarrier = new Barrier(0, barrierWidth, barrierHeight);
	var rightBarrier = this.rightBarrier = new Barrier(width, barrierWidth, barrierHeight);
	leftBarrier.random(0, height);
	rightBarrier.random(0, height);

	// Target
	var radius = width / 20;
	var target = this.target = new Target(radius);
	target.random(width, height);

	// Keyboard listener
	document.addEventListener('keydown', function(event) {
	    if(event.keyCode == 32) bird.flap();
	});

	this.draw = function() {
		var context = this.context;
		context.clearRect(0, 0, this.width, this.height);
		// Border
		context.beginPath();
		context.rect(0.5, 0.5, this.width - 1, this.height - 1);
		context.closePath();
		context.stroke();
		// Score
		context.fillText('SCORE: ' + this.score + ', BEST: ' + this.highscore, 5, 5);
		// Mirror-line, dashed
		var step = this.width / 50;
		var y = Math.floor(this.height / 2) + 0.5;
		var x = -step;
		context.beginPath();
		while (x < this.width) {
			context.moveTo(x += step, y);
			context.lineTo(x += step, y);
		}
		context.closePath();
		context.stroke();
		// Objects
		this.bird.draw(context);
		this.leftBarrier.draw(context);
		this.rightBarrier.draw(context);
		this.target.draw(context);
	}

	this.step = function() {
		var bird = this.bird;
		// Top and bottom collision
		var topCollision = bird.location.y - bird.radius <= 0;
		var bottomCollision = bird.location.y + bird.radius >= this.height;
		if (topCollision || bottomCollision) {
			this.reset();
			return;
		}
		// Left and right collision
		var leftCollision = bird.location.x - bird.radius <= 0 && bird.velocity.x < 0;
		var rightCollision = bird.location.x + bird.radius >= this.width && bird.velocity.x > 0;
		if (leftCollision || rightCollision) {
			var leftBarrierCollision = leftCollision && leftBarrier.colliding(bird);
			var rightBarrierCollision = rightCollision && rightBarrier.colliding(bird);
			if (leftBarrierCollision || rightBarrierCollision) {
				this.reset();
				return;
			}
			bird.reverse();
		}
		if (leftCollision) rightBarrier.random(0, this.height);
		if (rightCollision) leftBarrier.random(0, this.height);
		// Taget collision
		if (this.target.colliding(this.bird)) {
			this.target.random(this.width, this.height);
			this.score++;
		}
		// Step bird
		var frames = (Date.now() - this.lastStep) / (1000 / 60);
		bird.step(frames, this.height);
		this.lastStep = Date.now();
	}

	this.reset = function() {
		// Save highscore
		if (this.score > this.highscore) {
			this.setCookie('highscore', this.score, 365);
			this.highscore = this.score;
		}
		// Reset and prepare for new game
		this.score = 0;
		this.bird.location.x = this.width / 2;
		this.bird.location.y = this.height * 0.4;
		this.bird.velocity.y = 0;
		this.leftBarrier.random(0, this.height);
		this.rightBarrier.random(0, this.height);
		this.target.random(this.width, this.height);
	}

	this.setCookie = function(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		var expires = 'expires=' + d.toGMTString();
		document.cookie = cname + '=' + cvalue + '; ' + expires;
	}

	this.getCookie = function(cname) {
		var name = cname + '=';
		var ca = document.cookie.split(';');
		for(var i = 0; i < ca.length; i++) {
			var c = ca[i].trim();
			if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
		}
		return '';
	}

	// Highscore
	var highscore = this.getCookie('highscore');
	if (highscore != '') this.highscore = highscore;
}