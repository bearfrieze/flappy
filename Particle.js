function Particle(location, velocity, radius, lifespan, hue, flappy) {
	
	this.location = location;
	this.velocity = velocity;
	this.radius = radius;
	this.timer = Date.now() + lifespan * 1000;
	this.flappy = flappy;
	this.mass = 0.25;
	this.hue = hue;

	// Sprite
	var sprite = this.sprite = document.createElement('canvas');
	var size = Math.floor(this.radius * 3);
	sprite.width = size;
	sprite.height = size;
	var context = sprite.getContext('2d');
	context.beginPath();
	context.arc(
		this.sprite.width / 2, this.sprite.height / 2,
		this.radius,
		0, 2 * Math.PI
	);
	context.closePath();
	context.fillStyle = 'hsl(' + this.hue + ', 75%, 75%)';
	context.fill();

	this.draw = function(context) {
		context.drawImage(
			this.sprite,
			Math.round(this.location.x - this.sprite.width / 2),
			Math.round(this.location.y - this.sprite.height / 2)
		);
	}

	this.alive = function() {
		return Date.now() < this.timer;
	}
}

Particle.prototype = Object.create(Circle.prototype);