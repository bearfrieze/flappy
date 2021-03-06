function Target(radius) {
	
	this.location = new Vector(0, 0);
	this.radius = radius;

	this.random = function(start, stop) {
		var delta = stop.sub(start);
		this.location.x = start.x + this.radius + Math.random() * (delta.x - this.radius * 2);
		this.location.y = start.y + this.radius + Math.random() * (delta.y - this.radius * 2);
		this.hue = Math.random() * 360;
		start.release();
		stop.release();
	}

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

	this.colliding = function(bird) {
		var distance = bird.location.dist(this.location);
		var radiusCombined = bird.radius + this.radius;
		return distance <= radiusCombined;
	}
}