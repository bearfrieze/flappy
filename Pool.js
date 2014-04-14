function Pool(Constructor) {

	this.released = [];
	this.size = 0;

	this.get = function() {
		if (this.released.length > 0) {
			var object = this.released.pop();
		} else {
			var object = new Constructor();
			this.size++;
		}
		return object;
	}

	this.release = function(object) {
		this.released.push(object);
	}
}