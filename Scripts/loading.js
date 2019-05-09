const loadingScreen = document.querySelector(".loadingScreen");
const loadingFrame = document.querySelector(".loadingFrame");

function cancelLoadingScreen() {
	try {
		game.reset();
	} catch (err) {
		console.log(new Error("Error in game.reset()"), err);
		loadingFrame.innerHTML = "<p>An Error occured</p>";
		var e = true;
	} finally {
		loadingScreen.onclick = () => void(0);
	}
	if (!e) {
		animate.fadeout(loadingScreen, 1);
	}
}

function loadingFinished() {
	loadingFrame.innerHTML = "<p>Click to Play!</p>";
	loadingScreen.onclick = function() {
		cancelLoadingScreen();
	}
}
	