function Particle() {

	this.render = function() {
		if (!(this.hue in this.sprites)) {
			var sprite = this.sprites[this.hue] = document.createElement('canvas');
			var size = Math.floor(this.radius * 3);
			sprite.width = size;
			sprite.height = size;
			var context = sprite.getContext('2d');
			context.beginPath();
			context.arc(
				sprite.width / 2, sprite.height / 2,
				this.radius,
				0, 2 * Math.PI
			);
			context.closePath();
			context.fillStyle = 'hsl(' + this.hue + ', 75%, 75%)';
			context.fill();
		}
		this.sprite = this.sprites[this.hue];
	}

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

Particle.prototype.sprites = [];
Particle.prototype.hueStep = 360 / 12;

Particle.prototype.pool = new Pool(Particle);
Particle.prototype.get = function(location, velocity, radius, lifespan, hue, flappy) {
	var particle = this.pool.get();
	particle.location = location;
	particle.velocity = velocity;
	particle.radius = radius;
	particle.timer = Date.now() + lifespan * 1000;
	particle.hue = Math.round(hue / this.hueStep) * this.hueStep;
	particle.flappy = flappy;
	particle.mass = 0.25;
	particle.render();
	return particle;
}
Particle.prototype.release = function() {
	this.location.release();
	this.velocity.release();
	this.pool.release(this);
}