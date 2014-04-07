window.onload = function() {

	// Background color
	document.body.style.background = '#333';

	// Game dimensions
	var width = document.body.clientWidth;
	var height = document.body.clientHeight;
	var gameRatio = 2 / 3;
	var windowRatio = width / height;

	if (gameRatio < windowRatio) {
		height -= width / 30;
		width = height * gameRatio;
	} else {
		width -= height / 30;
		height = width / gameRatio;
	}
	
	width = Math.floor(width);
	height = Math.floor(height);

	// Game
	var flappy = new Flappy(width, height);

	// Negative margin centering
	flappy.canvas.style.position = 'absolute';
	flappy.canvas.style.top = '50%';
	flappy.canvas.style.left = '50%';
	flappy.canvas.style.marginLeft = -width / 2;
	flappy.canvas.style.marginTop = -height / 2;

	// Append
	document.body.appendChild(flappy.canvas);
	flappy.draw();

	// Loop
	function loop(stamp) {
		flappy.step();
		flappy.draw();
		requestAnimationFrame(loop);
	}

	// Start loop
	requestAnimationFrame(loop);
};