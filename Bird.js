function Bird(location, velocity, radius, gravity, flappy) {

	this.location = location;
	this.velocity = velocity;
	this.radius = radius;
	this.gravity = gravity;
	this.flappy = flappy;
	this.lastFlap = 0;

	this.draw = function(context) {
		context.beginPath();
		var flapShrink = 0;
		if (Date.now() - this.lastFlap < 100) flapShrink -= radius * 0.15;
		context.arc(
			Math.round(this.location.x), Math.round(this.location.y),
			this.radius + flapShrink,
			0, 2 * Math.PI
		);
		context.closePath();
		context.fill();
	}

	this.step = function(frames) {

		// Apply gravity to velocity
		var gravity = this.gravity.copy().mult(frames);
		if (this.below()) gravity.flipY();
		this.velocity.add(gravity);

		// Apply velocity to location
		var velocity = this.velocity.copy().mult(frames);
		this.location.add(velocity);
	}

	this.flap = function() {
		var strength = -this.gravity.y * 25;
		if (this.below()) strength = -strength;
		this.velocity.y = strength;
		this.lastFlap = Date.now();
	}

	this.reverse = function() {
		this.velocity.x = -this.velocity.x;
	}

	this.below = function() {
		return this.location.y > this.flappy.height / 2;
	}
}