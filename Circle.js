function Circle() {}

Circle.prototype.step = function(frames) {

	// Apply gravity to velocity
	var gravity = this.flappy.gravity.kopi().mult(this.mass).mult(frames);
	if (this.below()) gravity.flipY();
	this.velocity.add(gravity);
	gravity.release();

	// Apply velocity to location
	var velocity = this.velocity.kopi().mult(frames);
	this.location.add(velocity);
	velocity.release();
}

Circle.prototype.sideCollide = function() {
	if (this.location.x - this.radius <= 0 && this.velocity.x < 0) return -1;
	if (this.location.x + this.radius >= this.flappy.width && this.velocity.x > 0) return 1;
	return 0;
}

Circle.prototype.below = function() {
	return this.location.y > this.flappy.height / 2;
};

Circle.prototype.reverse = function() {
	this.velocity.x = -this.velocity.x;
};