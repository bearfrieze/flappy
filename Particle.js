function Particle(location, lifespan, flappy) {
	
	this.location = location;
	this.timer = Date.now() + lifespan * 1000;
	this.flappy = flappy;
	this.velocity = new Vector(0, 0);

	this.draw = function(context) {
		context.beginPath();
		context.arc(
			Math.round(this.location.x), Math.round(this.location.y),
			1,
			0, 2 * Math.PI
		);
		context.closePath();
		context.fill();
	}

	this.step = function(frames) {

		// Apply gravity to velocity
		var gravity = flappy.gravity.copy().mult(frames);
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
}