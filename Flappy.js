function Flappy(width, height) {
	
	this.width = width;
	this.height = height;

	// Canvas
	this.canvas = document.createElement('canvas');
	this.context = this.canvas.getContext('2d');
	this.canvas.width = this.width;
	this.canvas.height = this.height;
	this.canvas.style.background = "#333";

	// Bird
	var location = new Vector(width / 2, height / 2);
	this.bird = new Bird(location, width / 50);

	this.draw = function() {
		var context = this.context;
		this.bird.draw(context);
	};
};