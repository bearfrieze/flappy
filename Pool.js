function Pool(constructor) {
	this.constructor = constructor;
	this.released = [];
	this.size = 0;
}

Pool.prototype.get = function() {
	if (this.released.length > 0) {
		var object = this.released.pop();
	} else {
		var object = new this.constructor();
		this.size++;
	}
	return object;
}

Pool.prototype.release = function(object) {
	this.released.push(object);
}