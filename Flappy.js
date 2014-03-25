function flappy(width, height) {
	
	// Fields
	this.width = width;
	this.height = height;

	// Canvas
	this.canvas = document.createElement('canvas');
	this.context = this.canvas.getContext('2d');
	this.canvas.width = this.width;
	this.canvas.height = this.height;
};