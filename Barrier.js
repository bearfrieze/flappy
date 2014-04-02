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
		var center = new Vector(
			(this.start.x + this.stop.x) / 2,
			(this.start.y + this.stop.y) / 2
		);
		var distance = new Vector(
			Math.abs(circle.location.x - center.x),
			Math.abs(circle.location.y - center.y)
		);

		var width = this.stop.x - this.start.x;
		var height = this.stop.y - this.start.y;

		// Return false if circle is outside of rectangle
	    if (distance.x > (width / 2) + circle.radius) return false;
	    if (distance.y > (height / 2) + circle.radius) return false;

	    // Return true if circle center is inside of rectangle
	    if (distance.x <= width / 2) return true; 
	    if (distance.y <= height / 2) return true;

	    // Check wether circle is in reach of corners
	    cornerDistance = Math.sqrt(Math.pow(distance.x - (width / 2), 2) + Math.pow(distance.y - (height / 2), 2));
	    return cornerDistance <= Math.pow(circle.radius, 2);
	}
}