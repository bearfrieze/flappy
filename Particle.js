function Particle(location, velocity, radius, lifespan, flappy) {
	
	this.location = location;
	this.velocity = velocity;
	this.radius = radius;
	this.timer = Date.now() + lifespan * 1000;
	this.flappy = flappy;

	this.draw = function(context) {
		context.beginPath();
		context.arc(
			Math.round(this.location.x), Math.round(this.location.y),
			this.radius,
			0, 2 * Math.PI
		);
		context.closePath();
		context.fill();
	}

	this.step = function(frames) {

		// Apply gravity to velocity
		var gravity = flappy.gravity.copy().mult(frames).mult(0.25);
		if (this.below()) gravity.flipY();
		this.velocity.add(gravity);

		// Apply velocity to location
		var velocity = this.velocity.copy().mult(frames);
		this.location.add(velocity);
	}

	this.alive = function() {
		return Date.now() < this.timer;
	}

	this.below = function() {
		return this.location.y > this.flappy.height / 2;
	}

	this.reverse = function() {
		this.velocity.x = -this.velocity.x;
	}
}