function Barrier(x, width, height) {;

	this.location = new Vector(x, 0);
	this.width = width;
	this.height = height;

	this.random = function(min, max) {
		min += height / 2;
		max -= height;
		this.location.y = min + Math.random() * max;
	}

	this.draw = function(context) {
		context.beginPath();
		context.rect(
			this.location.x - this.width,
			this.location.y - this.height / 2,
			this.width * 2,
			this.height
		);
		context.closePath();
		context.fill();
	}

	this.colliding = function(bird) {
		var above = bird.location.y < this.location.y - this.height / 2;
		var below = bird.location.y > this.location.y + this.height / 2;
		return !above && !below;
	}
}