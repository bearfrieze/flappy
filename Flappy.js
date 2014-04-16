function Flappy(width, height) {
	
	this.width = width;
	this.height = height;
	this.score = 0;
	this.highscore = -1;
	this.gravity = new Vector(0, height / 2000);
	this.lastStep = Date.now();
	this.particles = [];

	// Canvas
	var canvas = this.canvas = document.createElement('canvas');
	canvas.width = this.width;
	canvas.height = this.height;
	canvas.style.background = '#333';
	
	// Context
	var context = this.context = canvas.getContext('2d');
	context.strokeStyle = 'white';
	context.lineWidth = Math.round(width / 150);
	context.font = width / 10 + 'px Menlo, Monaco, Consolas, "Lucida Console", monospace';
	context.textAlign = 'center';
	context.textBaseline = 'middle';

	// Bird
	var location = new Vector(width / 2, height * 0.4);
	var velocity = new Vector(width / 150, 0);
	var radius = width / 35;
	var bird = this.bird = new Bird(location, velocity, radius);

	// Barriers
	var barrierHeight = Math.round(height / 3);
	var barrierThickness = Math.round(width / 50);
	this.barriers = {
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

	// Target
	this.target = new Target(width / 15);

	// Listeners
	var that = this;
	document.addEventListener(
		'keydown',
		function(event) {if (event.keyCode == 32) bird.flap(that);}
	);
	if ('ontouchstart' in document.documentElement)
		canvas.addEventListener(
			'touchstart',
			function(event) {bird.flap(that);}
		);
	else
		canvas.addEventListener(
			'mousedown',
			function(event) {bird.flap(that);}
		);

	// Reset and start loop
	this.reset();
	this.startLoop();
}

Flappy.prototype.draw = function() {

	var context = this.context;
	var lineOffset = context.lineWidth / 2;
	context.clearRect(0, 0, this.width, this.height);
	context.fillStyle = 'white';

	// Mirror-line, dashed
	var step = context.lineWidth * 6;
	var gap = step * (5 / 8);
	var y = this.height / 2 - lineOffset;
	var x = -gap;
	context.beginPath();
	while (x < this.width) {
		context.moveTo(x += gap, y);
		context.lineTo(x += step, y);
	}
	context.closePath();
	context.stroke();

	// Score
	context.fillText(this.score + "/" + this.highscore, this.width / 2, this.height / 4);

	// Particles and target
	for (var i = 0; i < this.particles.length; i++) {
		this.particles[i].draw(context);
	}
	this.target.draw(context);
	context.fillStyle = 'white';

	// Borders and barriers
	context.beginPath();
	context.moveTo(lineOffset, 0);
	context.lineTo(lineOffset, this.height);
	context.moveTo(this.width - lineOffset, 0);
	context.lineTo(this.width - lineOffset, this.height);
	context.closePath();
	context.stroke();
	for (var barrier in this.barriers)
		this.barriers[barrier].draw(context);

	// Bird
	this.bird.draw(context);
}

Flappy.prototype.step = function() {

	var bird = this.bird;

	// Barrier collision
	for (var barrier in this.barriers) {
		if (this.barriers[barrier].colliding(bird)) {
			this.reset();
			return;
		}
	}

	// Left and right collision
	var collide = bird.sideCollide(this);
	if (collide != 0) bird.reverse();
	if (collide > 0) this.barriers.left.randomY(0, this.height);
	if (collide < 0) this.barriers.right.randomY(0, this.height);

	// Taget collision
	var target = this.target;
	if (target.colliding(bird)) {

		this.score++;

		// Spawn particles
		var newHighscore = this.score === this.highscore + 1;
		var n = (newHighscore) ? 200 : 100;
		var particle, angle, speed;
		for (var i = 0; i < n; i++) {
			particle = Particle.prototype.get();
			particle.location = target.location.kopi();
			angle = (Math.random() * 360) * Math.PI / 180;
			speed = Math.random() * bird.radius * 0.5;
			particle.velocity = Vector.prototype.get(Math.cos(angle) * speed, Math.sin(angle) * speed);
			particle.radius = bird.radius / 4;
			particle.timer = Date.now() + utilities.sinusRandom() * 3 * 1000;
			particle.hue = (newHighscore) ? Math.random() * 360 : target.hue - 30 + Math.random() * 60;
			particle.hue = Math.round(particle.hue / particle.hueStep) * particle.hueStep;
			particle.render();
			this.particles.push(particle);
		}

		// Random target location
		if (bird.location.y < this.height / 2)
			target.random(
				Vector.prototype.get(0, this.height / 2),
				Vector.prototype.get(this.width, this.height)
			);
		else
			target.random(
				Vector.prototype.get(0, 0),
				Vector.prototype.get(this.width, this.height / 2)
			);
	}
	
	// Determine number of frames passed
	var frames = (Date.now() - this.lastStep) / (1000 / 60);
	this.lastStep = Date.now();

	// Step bird
	bird.step(this, frames);

	// Step barriers
	this.barriers.left.step(frames);
	this.barriers.right.step(frames);

	// Step particles
	var particle, temp;
	for (var i = this.particles.length - 1; i >= 0; i--) {
		particle = this.particles[i];
		if (particle.alive()) {
			if (particle.sideCollide(this) != 0) particle.reverse();
			particle.step(this, frames);
		} else {
			// Delete particle if dead
			temp = this.particles[this.particles.length - 1];
			this.particles[this.particles.length - 1] = particle;
			this.particles[i] = temp;
			this.particles.pop().release();
		}
	}
}

Flappy.prototype.reset = function() {

	// Highscore
	if (this.highscore === -1) {
		this.highscore = utilities.getCookie('highscore');
		if (this.highscore === '') this.highscore = 0;
	} else if (this.score > this.highscore) {
		utilities.setCookie('highscore', this.score, 365);
		this.highscore = this.score;
	}

	// Reset and prepare for new game
	this.score = 0;
	this.bird.location.x = this.width / 2;
	this.bird.location.y = this.height * 0.4;
	this.bird.velocity.y = 0;
	this.barriers.left.randomY(0, this.height);
	this.barriers.right.randomY(0, this.height);
	this.target.random(new Vector(0, 0), new Vector(this.width, this.height));
}

Flappy.prototype.startLoop = function() {
	var that = this;
	var loop = function(stamp) {
		that.step();
		that.draw();
		requestAnimationFrame(loop);
	}
	requestAnimationFrame(loop);
}