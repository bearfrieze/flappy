function Vector(x, y) {

	this.x = x;
	this.y = y;

	this.add = function(vector) {
		this.x += vector.x;
		this.y += vector.y;
		return this;
	}

	this.sub = function(vector) {
		this.x -= vector.x;
		this.y -= vector.y;
		return this;
	}

	this.mult = function(multiplier) {
		this.x *= multiplier;
		this.y *= multiplier;
		return this;
	}

	this.div = function(divisor) {
		this.x /= divisor;
		this.y /= divisor;
		return this;
	}

	this.dist = function(vector) {
		var dx = this.x - vector.x;
		var dy = this.y - vector.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	this.flipY = function() {
		this.y = -this.y;
		return this;
	}

	this.abs = function() {
		this.x = Math.abs(this.x);
		this.y = Math.abs(this.y);
		return this;
	}

	this.copy = function() {
		return new Vector(this.x, this.y);
	}

	this.kopi = function() {
		return this.get(this.x, this.y);
	}
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