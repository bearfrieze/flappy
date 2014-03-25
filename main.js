// Style
document.body.style.background = '#333';

// Initialize game
var flappy = new Flappy(400, 600);
document.body.appendChild(flappy.canvas);
flappy.draw();

// Loop
// function loop(stamp) {
// 	flappy.step();
// 	flappy.draw();
// 	requestAnimationFrame(loop);
// }

// Begin
// requestAnimationFrame(loop);