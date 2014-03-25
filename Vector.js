function Vector(x, y) {

	this.x = x;
	this.y = y;

	this.add = function(vector) {
		this.x += vector.x;
		this.y += vector.y;
	}
};