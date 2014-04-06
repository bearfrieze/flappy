function Bird(location, velocity, radius, flappy) {

	this.location = location;
	this.velocity = velocity;
	this.radius = radius;
	this.flappy = flappy;
	this.lastFlap = 0;
	this.mass = 1;

	this.draw = function(context) {
		context.beginPath();
		var flapShrink = 0;
		if (Date.now() - this.lastFlap < 100) flapShrink -= radius * 0.2;
		context.arc(
			Math.round(this.location.x), Math.round(this.location.y),
			this.radius + flapShrink,
			0, 2 * Math.PI
		);
		context.closePath();
		context.fill();
	}

	this.flap = function() {
		var strength = -flappy.gravity.y * 25;
		if (this.below()) strength = -strength;
		this.velocity.y = strength;
		this.lastFlap = Date.now();
	}
}

Bird.prototype = Object.create(Circle.prototype);