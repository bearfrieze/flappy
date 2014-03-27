function Barrier(center, width, height) {;

	this.center = center;
	this.width = width;
	this.height = height;

	this.draw = function(context) {
		context.beginPath();
		context.rect(
			this.center.x - this.width,
			this.center.y - this.height / 2,
			this.width * 2,
			this.height
		);
		context.closePath();
		context.fill();
	};

	this.colliding = function(bird) {
		var above = bird.location.y < this.center.y - this.height / 2;
		var below = bird.location.y > this.center.y + this.height / 2;
		return !above && !below;
	};
}