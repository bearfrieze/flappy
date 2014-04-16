function Vector(x, y) {
	this.x = x;
	this.y = y;
}

Vector.prototype.add = function(vector) {
	this.x += vector.x;
	this.y += vector.y;
	return this;
}

Vector.prototype.sub = function(vector) {
	this.x -= vector.x;
	this.y -= vector.y;
	return this;
}

Vector.prototype.mult = function(multiplier) {
	this.x *= multiplier;
	this.y *= multiplier;
	return this;
}

Vector.prototype.div = function(divisor) {
	this.x /= divisor;
	this.y /= divisor;
	return this;
}

Vector.prototype.dist = function(vector) {
	var dx = this.x - vector.x;
	var dy = this.y - vector.y;
	return Math.sqrt(dx * dx + dy * dy);
}

Vector.prototype.flipY = function() {
	this.y = -this.y;
	return this;
}

Vector.prototype.abs = function() {
	this.x = Math.abs(this.x);
	this.y = Math.abs(this.y);
	return this;
}

Vector.prototype.copy = function() {
	return new Vector(this.x, this.y);
}

Vector.prototype.kopi = function() {
	return this.get(this.x, this.y);
}

Vector.prototype.pool = new Pool(Vector);

Vector.prototype.get = function(x, y) {
	var vector = this.pool.get();
	vector.x = x;
	vector.y = y;
	return vector;
}
Vector.prototype.release = function() {
	this.pool.release(this);
}