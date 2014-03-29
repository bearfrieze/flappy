function Bird(location, velocity, radius, gravity) {

	this.location = location;
	this.velocity = velocity;
	this.radius = radius;
	this.gravity = gravity;
	this.lastFlap = 0;

	this.draw = function(context) {
		context.beginPath();
		var flapShrink = 0;
		if (Date.now() - this.lastFlap < 100) flapShrink -= radius * 0.15;
		context.arc(
			Math.round(this.location.x), Math.round(this.location.y), // Center
			this.radius + flapShrink,
			0, 2 * Math.PI // Start and stop angles
		);
		context.closePath();
		context.fill();
	}

	this.step = function(frames) {
		this.velocity.add(this.gravity.copy().mult(frames));
		this.location.add(this.velocity.copy().mult(frames));
	}

	this.flap = function() {
		this.velocity.y = -this.gravity.y * 35;
		this.lastFlap = Date.now();
	}

	this.reverse = function() {
		this.velocity.x = -this.velocity.x;
	}
}