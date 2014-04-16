function Bird(location, velocity, radius) {
	this.location = location;
	this.velocity = velocity;
	this.radius = radius;
	this.lastFlap = 0;
	this.mass = 1;
}

Bird.prototype = Object.create(Circle.prototype);

Bird.prototype.draw = function(context) {
	context.beginPath();
	var flapShrink = 0;
	if (Date.now() - this.lastFlap < 100) flapShrink -= this.radius * 0.2;
	context.arc(
		Math.round(this.location.x), Math.round(this.location.y),
		this.radius + flapShrink,
		0, 2 * Math.PI
	);
	context.closePath();
	context.fillStyle = 'white';
	context.fill();
}

Bird.prototype.flap = function(flappy) {
	var strength = -flappy.gravity.y * 25;
	if (this.location.y > flappy.height / 2) strength = -strength;
	this.velocity.y = strength;
	this.lastFlap = Date.now();
}