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

	// Bird
	var location = new Vector(width / 2, height * 0.4);
	var velocity = new Vector(width / 150, 0);
	var radius = width / 50;
	var gravity = new Vector(0, height / 2000);
	var bird = this.bird = new Bird(location, velocity, radius, gravity, this);

	// Barriers
	var barrierHeight = Math.round(height / 3);
	var barrierThickness = Math.round(width / 70);
	var barriers = {
		left: new Barrier(
			new Vector(0, 0),
			new Vector(barrierThickness, barrierHeight)
		),
		right: new Barrier(
			new Vector(this.width - barrierThickness, 0),
			new Vector(this.width, barrierHeight)
		),
		top: new Barrier(
			new Vector(0, 0),
			new Vector(this.width, barrierThickness)
		),
		bottom: this.bottomBarrier = new Barrier(
			new Vector(0, this.height - barrierThickness),
			new Vector(this.width, this.height)
		)
	};
	barriers.left.randomY(0, height);
	barriers.right.randomY(0, height);
	this.barriers = barriers;

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

		// Border left and right
		context.beginPath();
		context.moveTo(0.5, 0.5);
		context.lineTo(0.5, this.height);
		context.moveTo(this.width - 0.5, 0.5);
		context.lineTo(this.width - 0.5, this.height);
		context.closePath();
		context.stroke();

		// Score
		context.font =  width / 15 + 'px Menlo, monospace';
		context.textAlign = 'center';
		context.textBaseline = 'bottom';
		context.fillText(this.score + "/" + this.highscore, this.width / 2, this.height / 5);

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
		for (var barrier in this.barriers)
			this.barriers[barrier].draw(context);
		this.target.draw(context);
	}

	this.step = function() {

		var bird = this.bird;

		// Barrier collision
		for (var barrier in this.barriers) {
			if (this.barriers[barrier].colliding(bird)) {
				this.reset();
				return;
			}
		}

		// Left and right collision
		var leftCollision = bird.location.x - bird.radius <= 0 && bird.velocity.x < 0;
		var rightCollision = bird.location.x + bird.radius >= this.width && bird.velocity.x > 0;
		if (leftCollision || rightCollision) bird.reverse();
		if (leftCollision) this.barriers.right.randomY(0, this.height);
		if (rightCollision) this.barriers.left.randomY(0, this.height);

		// Taget collision
		if (this.target.colliding(this.bird)) {
			this.target.random(this.width, this.height);
			this.score++;
		}
		
		// Step bird
		var frames = (Date.now() - this.lastStep) / (1000 / 60);
		bird.step(frames);
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
		this.barriers.left.randomY(0, this.height);
		this.barriers.right.randomY(0, this.height);
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