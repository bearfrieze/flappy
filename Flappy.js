function Flappy(width, height) {
	
	this.width = width;
	this.height = height;
	this.score = 0;

	// Canvas
	var canvas = this.canvas = document.createElement('canvas');
	canvas.width = this.width;
	canvas.height = this.height;
	canvas.style.background = '#333';
	canvas.style.border = "1px solid #FFF";
	
	// Context
	var context = this.context = canvas.getContext('2d');
	context.fillStyle = 'white';
	context.textAlign = 'center';
	context.font = '50px Menlo, monospace';

	// Bird
	var location = new Vector(width / 2, height / 2);
	var velocity = new Vector(width / 200, 0);
	var gravity = new Vector(0, height / 2000);
	var bird = this.bird = new Bird(location, velocity, width / 50, gravity);

	// Barriers
	var barrierWidth = width / 50;
	var barrierHeight = height / 5;
	var leftBarrier = this.leftBarrier = new Barrier(
		new Vector(0, height / 2),
		barrierWidth, barrierHeight
	);
	var rightBarrier = this.rightBarrier = new Barrier(
		new Vector(width, height / 2),
		barrierWidth, barrierHeight
	);

	// Keyboard listener
	document.addEventListener('keydown', function(event) {
	    if(event.keyCode == 32) bird.flap();
	});

	this.draw = function() {
		var context = this.context;
		context.clearRect(0, 0, this.width, this.height);
		this.bird.draw(context);
		context.fillText(this.score, this.width / 2, this.height / 2);
		this.leftBarrier.draw(context);
		this.rightBarrier.draw(context);
	};

	this.step = function() {
		var bird = this.bird;
		// Reset on top and bottom collision
		var topCollision = bird.location.y - bird.radius <= 0;
		var bottomCollision = bird.location.y + bird.radius >= this.height;
		if (topCollision || bottomCollision) {
			this.reset();
			return;
		}
		// Left and right collision
		var leftCollision = bird.location.x - bird.radius <= 0;
		var rightCollision = bird.location.x + bird.radius >= this.width;
		if (leftCollision || rightCollision) {
			var leftBarrierCollision = leftCollision && leftBarrier.colliding(bird);
			var rightBarrierCollision = rightCollision && rightBarrier.colliding(bird);
			if (leftBarrierCollision || rightBarrierCollision) {
				this.reset();
				return;
			}
			bird.reverse();
			this.score++;
		}
		// Apply veclocity
		bird.step();
	}

	this.reset = function() {
		this.score = 0;
		this.bird.location.x = width / 2;
		this.bird.location.y = height / 2;
		this.bird.velocity.y = 0;
	}
};