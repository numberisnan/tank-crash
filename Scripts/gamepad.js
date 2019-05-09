var gamepadinterval, player1gamepadindex, player2gamepadindex;

function controlLoop() {
	var gamepads = navigator.getGamepads();
	var gp1 = gamepads[player1gamepadindex];
	var gp2 = gamepads[player2gamepadindex];
	
	//Controls for player 1
	if (gp1) {
		if (gp1.buttons[7].value > 0.3 && !game.player1.speedBoostDisabled) {
			game.boostSpeed(game.player1);
		}
		
		if (gp1.axes[2] > 0.1 || gp1.axes[2] < -0.1) {
			for (t in game.player1.tanks) {
				game.player1.tanks[t].vturn = 4/game.fps * -gp1.axes[2];
			}
		} else {
			for (t in game.player1.tanks) {
				game.player1.tanks[t].vturn = 0;
			}
		}
		
		if (gp1.axes[1] < -0.1 || gp1.axes[1] > 0.1) {
			for (t in game.player1.tanks) {
				game.player1.tanks[t].v = game.player1.v/game.fps * -gp1.axes[1];
			}
			if (!game.pauseDisabled && !game.paused && tn1.paused) {
				tn1.loopAudio(100);
			}
		} else {
			for (t in game.player1.tanks) {
				game.player1.tanks[t].v = 0;
				tn1.pause();
			}
		}
	}
	
	if (gp2) {
		//Controls for player 2
		if (gp2.buttons[7].value > 0.3 && !game.player2.speedBoostDisabled) {
			game.boostSpeed(game.player2);
		}
		
		if (gp2.axes[2] > 0.1 || gp2.axes[2] < -0.1) {
			for (t in game.player2.tanks) {
				game.player2.tanks[t].vturn = 4/game.fps * -gp2.axes[2];
			}
		} else {
			for (t in game.player2.tanks) {
				game.player2.tanks[t].vturn = 0;
			}
		}
		
		if (gp2.axes[1] < -0.1 || gp2.axes[1] > 0.1) {
			for (t in game.player2.tanks) {
				game.player2.tanks[t].v = game.player2.v/game.fps * -gp2.axes[1];
			}
			if (!game.pauseDisabled && !game.paused && tn2.paused) {
				tn2.loopAudio(100);
			}
		} else {
			for (t in game.player2.tanks) {
				game.player2.tanks[t].v = 0;
				tn2.pause();
			}
		}
	}
}

function gamepadconnectedhandler(e) {
	if (e.gamepad.mapping == "standard") {
		var gp = e.gamepad;
		if (!player1gamepadindex && player1gamepadindex !== 0) {
			player1gamepadindex = gp.index;
		} else if (!player2gamepadindex && player2gamepadindex !== 0) {
			player2gamepadindex = gp.index;
		}
		console.log("Gamepad connected at port " + gp.index);
		if (!gamepadinterval) {
			gamepadinterval = setInterval(controlLoop, 100);
		}
	}
	
}

function gamepaddisconnectedhandler(e) {
	if (e.gamepad.index == player1gamepadindex) {
		player1gamepadindex = false;
	} else if (e.gamepad.index == player2gamepadindex) {
		delete player2gamepadindex;
	}
	if (!player1gamepadindex && player1gamepadindex !== 0 && !player2gamepadindex && player2gamepadindex !== 0) {
		clearInterval(gamepadinterval);
		gamepadinterval = false;
	}
	console.log("Gamepad disconnected at port " + e.gamepad.index)
}

window.addEventListener("gamepadconnected", gamepadconnectedhandler);
window.addEventListener("gamepaddisconnected", gamepaddisconnectedhandler);