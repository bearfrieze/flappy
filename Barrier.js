function Barrier(start, stop) {
	this.start = start;
	this.stop = stop;
	this.destination = start.y;
	this.dimensions = stop.copy().sub(start);
}

Barrier.prototype.randomY = function(min, max) {
	var height = this.stop.y - this.start.y;
	this.destination = min + Math.random() * ((max - height) - min);
}

Barrier.prototype.step = function(frames) {
	var movement = (this.destination - this.start.y) / 30 * frames;
	this.start.y += movement;
	this.stop.y += movement;
}

Barrier.prototype.draw = function(context) {
	context.beginPath();
	context.rect(
		this.start.x,
		this.start.y,
		this.stop.x - this.start.x,
		this.stop.y - this.start.y
	);
	context.closePath();
	context.fillStyle = 'white';
	context.fill();
}

Barrier.prototype.colliding = function(bird) {

	// Using this method: http://stackoverflow.com/a/402010

	var circle = bird;
	var center = this.start.kopi().add(this.stop).div(2);
	var distance = circle.location.kopi().sub(center).abs();
	center.release();

	// Return false if circle is outside of rectangle
	if (distance.x > (this.dimensions.x / 2) + circle.radius) {distance.release(); return false;}
	if (distance.y > (this.dimensions.y / 2) + circle.radius) {distance.release(); return false;}

	// Return true if circle center is inside of rectangle
	if (distance.x <= this.dimensions.x / 2) {distance.release(); return true;}
	if (distance.y <= this.dimensions.y / 2) {distance.release(); return true;}

	// Check wether circle is in reach of corners
	var cornerDistance = distance.dist(this.dimensions.div(2));
	distance.release();
	return cornerDistance <= circle.radius;
}