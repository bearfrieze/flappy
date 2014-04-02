function Barrier(start, stop) {

	this.start = start;
	this.stop = stop;

	this.randomY = function(min, max) {
		var height = this.stop.y - this.start.y;
		max -= height;
		var random = Math.round(min + Math.random() * (max - min));
		this.start.y = random;
		this.stop.y = random + height;
	}

	this.draw = function(context) {
		context.beginPath();
		context.rect(
			this.start.x,
			this.start.y,
			this.stop.x - this.start.x,
			this.stop.y - this.start.y
		);
		context.closePath();
		context.fill();
	}

	this.colliding = function(bird) {
		var circle = bird;
		var center = this.start.copy().add(this.stop).div(2);
		var distance = circle.location.copy().sub(center).abs();
		var dimensions = this.stop.copy().sub(this.start);

		// Return false if circle is outside of rectangle
	    if (distance.x > (dimensions.x / 2) + circle.radius) return false;
	    if (distance.y > (dimensions.y / 2) + circle.radius) return false;

	    // Return true if circle center is inside of rectangle
	    if (distance.x <= dimensions.x / 2) return true;
	    if (distance.y <= dimensions.y / 2) return true;

	    // Check wether circle is in reach of corners
	    var cornerDistance = distance.dist(dimensions.copy().div(2));
	    return cornerDistance <= circle.radius;
	}
}