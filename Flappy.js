function Flappy(width, height) {
	
	this.width = width;
	this.height = height;
	this.score = 0;
	this.highscore = -1;
	this.lastStep = Date.now();
	this.particles = [];
	this.gravity = new Vector(0, height / 2000);

	// Performance
	var timers = this.timers = {
		draw: [],
		step: []
	};
	var performance = function(timers) {
		for (var key in timers) {
			// Compute 90th percentile average
			var percentile = 0;
			timers[key].sort(function(a,b){return b-a}); // Sort descending
			var interval = Math.round(timers[key].length * 0.1);
			for (var i = 0; i < interval; i++) percentile += timers[key][i];
			percentile = (percentile / interval).toFixed(2);
			// Compute accumulated
			var accumulated = 0;
			for (var i = 0; i < timers[key].length; i++) accumulated += timers[key][i];
			// Compute average
			var average = (accumulated / timers[key].length).toFixed(2);
			// Output
			console.log(key + ' | average: ' + average + ', percentile: ' + percentile + ', accumulated: ' + accumulated);
		}
	};
	setTimeout(function() {performance(timers)}, 10000);

	// Canvas
	var canvas = this.canvas = document.createElement('canvas');
	canvas.width = this.width;
	canvas.height = this.height;
	canvas.style.background = '#333';
	
	// Context
	var context = this.context = canvas.getContext('2d');
	context.strokeStyle = 'white';
	context.lineWidth = '1';

	// Bird
	var location = new Vector(width / 2, height * 0.4);
	var velocity = new Vector(width / 150, 0);
	var radius = width / 50;
	var bird = this.bird = new Bird(location, velocity, radius, this);

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
	this.barriers = barriers;

	// Target
	var target = this.target = new Target(width / 20);

	// Keyboard listener
	document.addEventListener('keydown', function(event) {
	    if(event.keyCode == 32) bird.flap();
	});

	// Touch/click listener
	if ('ontouchstart' in document.documentElement) {
		canvas.addEventListener('touchstart', function(event) {
			bird.flap();
		}, false);
	} else {
		canvas.addEventListener('mousedown', function(event) {
			bird.flap();
		}, false);
	}

	this.draw = function() {

		var timer = Date.now();

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
		context.fillStyle = 'white';
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
		
		// Particles
		for (var i = 0; i < this.particles.length; i++) {
			this.particles[i].draw(context);
		}

		this.timers.draw.push(Date.now() - timer);
	}

	this.step = function() {

		var timer = Date.now();

		var bird = this.bird;

		// Barrier collision
		for (var barrier in this.barriers) {
			if (this.barriers[barrier].colliding(bird)) {
				this.reset();
				return;
			}
		}

		// Left and right collision
		var collide = bird.sideCollide();
		if (collide != 0) bird.reverse();
		if (collide > 0) this.barriers.left.randomY(0, this.height);
		if (collide < 0) this.barriers.right.randomY(0, this.height);

		// Taget collision
		var target = this.target;
		if (target.colliding(bird)) {

			this.score++;
			var newHighscore = this.score === this.highscore + 1;

			// Spawn particles
			var n = (newHighscore) ? 200 : 100;
			for (var i = 0; i < n; i++) {
				var angle = (Math.random() * 360) * Math.PI / 180;
				var speed = Math.random() * bird.radius * 0.5;
				var velocity = new Vector(Math.cos(angle) * speed, Math.sin(angle) * speed);
				var lifespan = 1.5 + Math.random() * 1;
				var hue = (newHighscore) ? Math.round(Math.floor(Math.random() * 6) * 360 / 6) : target.hue;
				var particle = new Particle(target.location.copy(), velocity, bird.radius / 4, lifespan, hue, this);
				this.particles.push(particle);
			}

			// Random target location
			if (bird.location.y < this.height / 2)
				target.random(
					new Vector(0, this.height / 2),
					new Vector(this.width, this.height)
				);
			else
				target.random(
					new Vector(0, 0),
					new Vector(this.width, this.height / 2)
				);
		}
		
		var frames = (Date.now() - this.lastStep) / (1000 / 60);
		this.lastStep = Date.now();

		// Step bird
		bird.step(frames);

		// Step barriers
		this.barriers.left.step(frames);
		this.barriers.right.step(frames);

		// Step particles
		var temp = null;
		for (var i = this.particles.length - 1; i >= 0; i--) {
			var particle = this.particles[i];
			if (particle.sideCollide() != 0) particle.reverse();
			if (particle.alive()) {
				particle.step(frames);
			} else {
				// Delete particle if dead
				temp = this.particles.pop();
				if (this.particles.length > 0) this.particles[i] = temp;
			}
		}

		this.timers.step.push(Date.now() - timer);
	}

	this.reset = function() {

		// Highscore
		if (this.highscore === -1) {
			this.highscore = this.getCookie('highscore');
			if (this.highscore === '') this.highscore = 0;
		} else if (this.score > this.highscore) {
			this.setCookie('highscore', this.score, 365);
			this.highscore = this.score;
		}

		// Reset and prepare for new game
		this.score = 0;
		bird.location.x = this.width / 2;
		this.bird.location.y = this.height * 0.4;
		this.bird.velocity.y = 0;
		this.barriers.left.randomY(0, this.height);
		this.barriers.right.randomY(0, this.height);
		this.target.random(new Vector(0, 0), new Vector(this.width, this.height));
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

	this.reset();
}