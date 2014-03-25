function Bird(location, radius) {

	this.location = location;
	this.radius = radius;

	this.draw = function(context) {
		context.fillStyle = 'white';
		context.beginPath();
		context.arc(
			Math.round(location.x), Math.round(location.y), // Center
			radius,
			0, 2*Math.PI // Start and stop angles
		);
		context.closePath();
		context.fill();
	}
};