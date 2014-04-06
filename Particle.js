function Particle(location, velocity, radius, lifespan, hue, flappy) {
	
	this.location = location;
	this.velocity = velocity;
	this.radius = radius;
	this.timer = Date.now() + lifespan * 1000;
	this.flappy = flappy;
	this.mass = 0.25;
	this.hue = hue;

	this.draw = function(context) {
		context.beginPath();
		context.arc(
			Math.round(this.location.x), Math.round(this.location.y),
			this.radius,
			0, 2 * Math.PI
		);
		context.closePath();
		context.fillStyle = 'hsl(' + this.hue + ', 75%, 75%)';
		context.fill();
	}

	this.alive = function() {
		return Date.now() < this.timer;
	}
}

Particle.prototype = Object.create(Circle.prototype);