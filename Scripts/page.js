//Constructors

//c is color, a is starting x value for tank (center), b is starting y value for tank (center), t is counterclockwise turn from facing right in radians, p is boolean for whether the tank is the primary tank or not
function Tank(c, a, b, t) {
	this.v = 0;
	this.vturn = 0;
	this.width = 25;
	this.height = 25;
	this.x = a - (this.width/2);
	this.y = b - (this.height/2);
	this.getCenter = function() {
		return [this.x + (this.width/2), this.y + (this.height/2)];
	};
	this.turn = t;
	this.color = c;
}

//c is color, x1 and y1 are coordinates of bottom-left corner, w and h are width and height
//Walls must be geater than game.playerx.tanks[x].width/2 to be detected by collision function
function Wall(c, x, y, w, h) {
	this.x1 = x;
	this.x2 = x + w;
	this.y1 = y;
	this.y2 = y + h;
	this.height = h;
	this.width = w;
	this.color = c;
	this.destroyed = false;
}

//c is color, x1 and y1 are coordinates of bottom-left corner, w and h are width and height, o is opacity
function Line(c, x, y, w, h, o) {
	this.x1 = x;
	this.x2 = x + w;
	this.y1 = y;
	this.y2 = y + h;
	this.height = h;
	this.width = w;
	this.color = c;
	this.opacity = o;
} 

//Main game variable
var game = {
	walls: [],
	player1: {
		p: 1,
		tanks: [],
		speedBoost: 0,
		speedBoostDisabled: false,
		color: "red",
		altcolor: "hotPink",
		score: 0,
	},
	player2: {
		p: 2,
		tanks: [],
		speedBoost: 0,
		speedBoostDisabled: false,
		color: "blue",
		altcolor: "lightBlue",
		score: 0
	},
	boostRefresh: 4000,
	boostTime: 750,
	boostSpeed: function(p) {
		var boostTime = game.boostTime;
		var boostRefresh = game.boostRefresh;
		p.speedBoostDisabled = true;
		p.speedBoost = (6*30);
		
		var lb = document.querySelector(".boostFrame" + p.p + " .loadingBar");
		lb.style.backgroundColor = p.altcolor;
		lb.style.transition = "height " + (boostRefresh/1000) + "s linear";
		lb.style.height = "0";
		
		setTimeout(function() {
			p.speedBoost = 0;
			lb.style.backgroundColor = p.color;
		}, boostTime);
		
		setTimeout(function() {
			p.speedBoostDisabled = false;
			lb.style.transition = "";
			lb.style.height = "100%";
		}, boostRefresh);
	},
	area: {
		width: 1060,
		height: 530
	},
	fps: 20,
	scoreLimit: 5,
	round: 1,
	
	paused: false,
	pauseDisabled: false,
	isMessaging: false,
	
	keys: [],
	
	reset: function() {
		if (game.ended) {
			return;
		}
	
		background.loopAudio("current");
	
		game.player1.tanks = [];
		game.player2.tanks = [];
		
		game.updateScore();
		game.pauseDisabled = false;
		
		gameFrame.innerHTML = '<div id="explosionBox"><div id="explosionFrame"></div></div>';
	
		try {
		maps.applyMap();
		}
		catch (err) {
			console.log(new Error("Error in maps module"), err);
		}
		
		//Add tanks to tanks array
		for (var i = 0; i < game.player1.n; i++) {
			do {
				var x = Math.random() * (game.area.width/2 - 80) + 40;
				var y = Math.random() * (game.area.height - 80) + 40;
				var t = Math.random() * Math.PI * 2;
				game.player1.tanks[i] = new Tank(game.player1.color, x, y, t);
				c = game.checkForCollision(game.player1.tanks[i]).result;
			} while (game.checkForCollision(game.player1.tanks[i]).result)
		}
		
		for (var i = 0; i < game.player2.n; i++) {
			do {
				var x = Math.random() * (game.area.width/2 - 80) + 40 + (game.area.width/2);
				var y = Math.random() * (game.area.height - 80) + 40;
				var t = Math.random() * Math.PI * 2;
				game.player2.tanks[i] = new Tank(game.player2.color, x, y, t);
				c = game.checkForCollision(game.player2.tanks[i]).result;
			} while (game.checkForCollision(game.player2.tanks[i]).result)
		}
		
		game.setupFunction();
		
		//Create tank elements and render them
		for (t in game.player1.tanks) {
			var e = document.createElement("IMG");
			var tank = game.player1.tanks[t];
			e.style.left = tank.x + "px";
			e.style.width = tank.width + "px";
			e.style.height = tank.height + "px";
			e.style.bottom = tank.y + "px";
			e.style.transform = "rotate(" + tank.turn + "rad)";
			if ((t != 0 && !game.primaryTankDisabled) || game.primaryTankDisabled) {
				e.style.opacity = 0.85;
			} else if (t == 0) {
				e.style.filter = "contrast(300%)";
			}
			e.className = "tank";
			e.id = "tankA" + t;
			e.src = "Graphics/" + tank.color + "tank.png";
			document.getElementById("gameFrame").appendChild(e);
		}
		
		for (t in game.player2.tanks) {
			var e = document.createElement("IMG");
			var tank = game.player2.tanks[t];
			e.style.left = tank.x + "px";
			e.style.width = tank.width + "px";
			e.style.height = tank.height + "px";
			e.style.bottom = tank.y + "px";
			e.style.transform = "rotate(" + tank.turn + "deg)";
			if ((t != 0 && !game.primaryTankDisabled) || game.primaryTankDisabled) {
				e.style.opacity = 0.85;
			} else if (t == 0) {
				e.style.filter = "contrast(300%)";
			}
			e.className = "tank";
			e.id = "tankB" + t;
			e.src = "Graphics/" + tank.color + "tank.png";
			document.getElementById("gameFrame").appendChild(e);
		}
		
		//Add score styles
		var p1 = (game.player1.color == "black") ? "white" : game.player1.color;
		var p2 = (game.player2.color == "black") ? "white" : game.player2.color;
		document.querySelector(".scorestyle").innerHTML = "#p1 { color: " + p1 + " } #p2 { color: " + p2 + "}"; 
		
		game.start();
	},
	pause: function() {
		if (!game.paused) {
			clearInterval(game.interval);
			delete game.interval;
			game.paused = true;
			game.message("PAUSED", -1);
		} else {
			game.start();
			game.paused = false;
		}
	},
	start: function() {
		//Event listener for controls
		window.addEventListener("keydown", game.keydownhandler, true);
		window.addEventListener("keyup", game.keyuphandler, true);
		window.addEventListener("keyhold", game.keyholdhandler, true);
		
		if (!game.interval) {
			game.interval = setInterval(game.updateArea, 1000/game.fps);
		}
		
		game.message("", 0);
	},
	updateArea: function() {
		for (t in game.player1.tanks) {
			var tank = game.player1.tanks[t];
			var e = document.querySelector("#tankA" + t);
			if (tank.v > 0) {
				var v = tank.v + (game.player1.speedBoost/game.fps);
			} else if (tank.v < 0) {
				var v = tank.v - (game.player1.speedBoost/game.fps);
			} else {
				var v = tank.v;
			}
			

			//Update player one's tanks
			var vturn = tank.vturn;
			var x = Math.cos(tank.turn) * v;
			var y = Math.sin(tank.turn) * v;
			
			tank.turn += vturn;
			tank.x += x;
			tank.y += y;
			
			var c = game.checkForCollision(tank);
			
			if (game.player1.customWinFunction(tank, t, c) || game.player2.customLoseFunction(game.player2.tanks[t], t, c)) {
				game.primaryTankDisabled = false;
				delete game.player2.tanks[0];
				game.checkForGameEnd();
				break;
			} else if (c.result) {
				tank.x -= x;
				tank.y -= y;
				if (c.object == "tank") {
					//tank collision handler
					document.querySelector("#tankB" + c.detail).classList.add("sploded");
					document.querySelector("#tankA" + t).classList.add("sploded");
					
					game.explosion(c.p.x, c.p.y, t, c.detail);
					
					delete game.player2.tanks[c.detail];
					delete game.player1.tanks[t];
					
					game.checkForGameEnd();
				} else if (c.object == "wall" ) {
					switch (c.color) {
						case "yellow":
							//electric wall collision handler
							document.querySelector("#tankA" + t).classList.add("sploded");
					
							game.explosion(c.p.x, c.p.y, t, false);
					
							delete game.player1.tanks[t];
							
							game.checkForGameEnd();
							break;
						case "lawnGreen":
							if (game.walls[c.detail].x1 >= game.area.width/2 && game.walls[c.detail].x2 >= game.area.width/2) {
								//Breakable wall handler
								document.querySelector("#tankA" + t).classList.add("sploded");
								document.querySelector("#wall" + c.detail).classList.add("sploded");
								
								game.explosion(c.p.x, c.p.y, t, "#wall" + c.detail);
								
								delete game.player1.tanks[t];
								delete game.walls[c.detail];
								
								game.checkForGameEnd();
							}
							break;
						case game.player2.color:
							//Other team's building collision handler
							game.walls[c.detail].destroyed = true;
							
							document.querySelector("#tankA" + t).classList.add("sploded");
							document.querySelector("#wall" + c.detail).classList.add("sploded");
							document.querySelector("#wall" + c.detail).style.backgroundColor = game.player1.color;
							
							game.explosion(c.p.x, c.p.y, t, false);
							
							delete game.player1.tanks[t];
							
							game.checkForGameEnd();
							break;
					}
					
				}
			} else if (game.player1.customWinFunction(tank, t, c) || game.player2.customLoseFunction(game.player2.tanks[t], t, c)) {
				game.primaryTankDisabled = false;
				delete game.player2.tanks[0];
				game.checkForGameEnd();
				break;
			} else {
				e.style.bottom = tank.y + "px";
				e.style.left = tank.x + "px";
			}
			
			e.style.transform = "rotate(" + tank.turn*-1 + "rad)";
		}
		
		for (t in game.player2.tanks) {
			var tank = game.player2.tanks[t];
			var e = document.querySelector("#tankB" + t);
			if (tank.v > 0) {
				var v = tank.v + (game.player2.speedBoost/game.fps);
			} else if (tank.v < 0) {
				var v = tank.v - (game.player2.speedBoost/game.fps);
			} else {
				var v = tank.v;
			}
				
			//Update player two's tanks
			var vturn = tank.vturn;
			var x = Math.cos(tank.turn) * v;
			var y = Math.sin(tank.turn) * v;
			
			tank.turn += vturn;
			tank.x += x;
			tank.y += y;
			
			var c = game.checkForCollision(tank);
			
			if (game.player2.customWinFunction(tank, t, c) || game.player1.customLoseFunction(game.player1.tanks[t], t, c)) {
				game.primaryTankDisabled = false;
				delete game.player1.tanks[0];
				game.checkForGameEnd();
				break;
			} else if (c.result) {
				tank.x -= x;
				tank.y -= y;
				if (c.object == "tank") {
					//tank collision handler
					document.querySelector("#tankA" + c.detail).classList.add("sploded");
					document.querySelector("#tankB" + t).classList.add("sploded");
					
					game.explosion(c.p.x, c.p.y, c.detail, t);
					
					delete game.player1.tanks[c.detail];
					delete game.player2.tanks[t];
					
					game.checkForGameEnd();
				} else if (c.object == "wall") {
					switch (c.color) {
						case "yellow":
							//electric wall collision handler
							document.querySelector("#tankB" + t).classList.add("sploded");
					
							game.explosion(c.p.x, c.p.y, false, t);
					
							delete game.player2.tanks[t];
							
							game.checkForGameEnd();
							break;
						case "lawnGreen":
							if (game.walls[c.detail].x1 <= game.area.width/2 && game.walls[c.detail].x2 <= game.area.width/2) {
								//Breakable wall handler
								document.querySelector("#tankB" + t).classList.add("sploded");
								document.querySelector("#wall" + c.detail).classList.add("sploded");
								
								game.explosion(c.p.x, c.p.y, "#wall" + c.detail, t);
								
								delete game.player2.tanks[t];
								delete game.walls[c.detail];
								
								game.checkForGameEnd();
							}
							break;
						case game.player1.color:
							//Other team's building collision handler
							game.walls[c.detail].destroyed = true;
							
							document.querySelector("#tankB" + t).classList.add("sploded");
							document.querySelector("#wall" + c.detail).classList.add("sploded");
							document.querySelector("#wall" + c.detail).style.backgroundColor = game.player2.color;
							
							game.explosion(c.p.x, c.p.y, false, t);
							
							delete game.player2.tanks[t];
							
							game.checkForGameEnd();
							break;
					}
				}
			}  else {
				e.style.bottom = tank.y + "px";
				e.style.left = tank.x + "px";
			}
			
			e.style.transform = "rotate(" + tank.turn*-1 + "rad)";
		}
	},
	keyholdhandler: function(event) {
		var kC = event.detail || event.keyCode;
		
		//Buttons
		switch (kC) {
			case 13:
				if (!game.player2.speedBoostDisabled) {
					game.boostSpeed(game.player2);
				}
				break;
			case 90:
				if (!game.player1.speedBoostDisabled) {
					game.boostSpeed(game.player1);
				}
				break;
			case 80:
				if (!game.pauseDisabled) {
					game.pause();
				}
				break;
			case 77:
				if (background.volume == 0) {
					background.volume = 1;
					background.play();
				} else {
					background.volume = 0;
					background.pause();
				}
				break;
			case 88:
				var a = [player1gamepadindex, player2gamepadindex];
				player1gamepadindex = a[1];
				player2gamepadindex = a[0];
			}
	
		//Controls for player 2
		switch (kC) {
			case 38:
				for (t in game.player2.tanks) {
					game.player2.tanks[t].v = game.player2.v/game.fps;
				}
				if (!game.pauseDisabled && !game.paused) {
					tn2.loopAudio(100);
				}
				break;
			case 40:
				for (t in game.player2.tanks) {
					game.player2.tanks[t].v = -game.player2.v/game.fps;
				}
				if (!game.pauseDisabled && !game.paused) {
					tn2.loopAudio(100);
				}
				break;
		}
		switch (kC) {
			case 37:
				for (t in game.player2.tanks) {
					game.player2.tanks[t].vturn = 4/game.fps;
				}
				break;
			case 39:
				for (t in game.player2.tanks) {
					game.player2.tanks[t].vturn = -4/game.fps;
				}
				break;
		}
		
		//Controls for player 1
		for (t in game.player1.tanks) {
			var tank = game.player1.tanks[t];
			switch (kC) {
				case 87:
					for (t in game.player1.tanks) {
						game.player1.tanks[t].v = game.player1.v/game.fps;
					}
					if (!game.pauseDisabled && !game.paused) {
						tn1.loopAudio(100);
					}
					break;
				case 83:
					for (t in game.player1.tanks) {
						game.player1.tanks[t].v = -game.player1.v/game.fps;
					}
					if (!game.pauseDisabled && !game.paused) {
						tn1.loopAudio(100);
					}
					break;
			}
			switch (kC) {
				case 65:
					for (t in game.player1.tanks) {
						game.player1.tanks[t].vturn = 4/game.fps;
					}
					break;
				case 68:
					for (t in game.player1.tanks) {
						game.player1.tanks[t].vturn = -4/game.fps;
					}
					break;
			}
		}
		//console.log(kC);
	},
	keyuphandler: function(event) {
		var kC = event.detail || event.keyCode;
		delete game.keys[kC];
		
		//Controls for player 2
		var tank = game.player2.tanks[t];
		switch (kC) {
			case 38:
			case 40:
				for (t in game.player2.tanks) {
					game.player2.tanks[t].v = 0;
				}
				tn2.pause();
				break;
		}
		switch (kC) {
			case 37:
			case 39:
				for (t in game.player2.tanks) {
					game.player2.tanks[t].vturn = 0;
				}
				break;
		}
		
		//Controls for player 1
		var tank = game.player1.tanks[t];
		switch (kC) {
			case 87:
			case 83:
				for (t in game.player1.tanks) {
					game.player1.tanks[t].v = 0;
				}
				tn1.pause();
				break;
		}
		switch (kC) {
			case 65:
			case 68:
				for (t in game.player1.tanks) {
					game.player1.tanks[t].vturn = 0;
				}
				break;
		}
	},
	checkForCollision: function(particle) {
	//
	//    Collision points are as shown (regardless of turn):
	//
	//           width
	//    1------4------0  h
	//    |                   |  i
	//    |                   |  e
	//    7    TA 6 NK    8  g
	//    |                   |  h
	//    |                   |  t
	//    3------5------2
	//
	//
		particle.collisionPoints = [];
		var a = particle.getCenter()[0];
		var b = particle.getCenter()[1];
		var d = (particle.width/2) * Math.sqrt(2) * 0.7;
		var ddirect = d / Math.sqrt(2);
		var result;
		
		particle.collisionPoints[0] = {
			x: a + d,
			y: b + d
		}
		
		particle.collisionPoints[1] = {
			x: a - d,
			y: b + d
		}
		
		particle.collisionPoints[2] = {
			x: a + d,
			y: b - d
		}
		
		particle.collisionPoints[3] = {
			x: a - d,
			y: b - d
		}
		
		particle.collisionPoints[4] = {
			x: a,
			y: b + ddirect
		}
		
		particle.collisionPoints[5] = {
			x: a,
			y: b - ddirect
		}
		
		particle.collisionPoints[6] = {
			x: a,
			y: b
		}
		
		particle.collisionPoints[7] = {
			x: a - ddirect,
			y: b
		}
		
		particle.collisionPoints[8] = {
			x: a + ddirect,
			y: b
		}
		
		for (p in particle.collisionPoints) {
			var point = particle.collisionPoints[p];
			
			if (point.x >= game.area.width || point.x <= 0 || point.y >= game.area.height || point.y <= 0) {
				result = {
					result: true,
					object: "area",
					p: {
						x: point.x,
						y: point.y
					}
				}
				return result;
			}
			
			for (w in game.walls) {
				var wall = game.walls[w];
				if (point.x >= wall.x1 && point.x <= wall.x2 && point.y >= wall.y1 && point.y <= wall.y2) {
					result = {
						result: true,
						object: "wall",
						detail: w,
						color: wall.color,
						p: {
							x: point.x,
							y: point.y
						}
					}
					return result;
				}
			}
			
			if (particle.color == game.player2.color) {
				for (l in game.player1.tanks) {
					var tank = game.player1.tanks[l];
					var d = (tank.width - 2) / 2;
					var x = tank.getCenter()[0];
					var y = tank.getCenter()[1];
					if (point.x >= x - d && point.x <= x + d && point.y >= y - d && point.y <= y + d) {
						result = {
							result: true,
							object: "tank",
							detail: l,
							p: {
								x: point.x,
								y: point.y
							}
						}
						return result;
					}
				}
			} else {
				for (g in game.player2.tanks) {
					var tank = game.player2.tanks[g];
					var d = (tank.width - 2) / 2;
					var x = tank.getCenter()[0];
					var y = tank.getCenter()[1];
					if (point.x >= x - ddirect && point.x <= x + ddirect && point.y >= y - ddirect && point.y <= y + ddirect) {
						result = {
							result: true,
							object: "tank",
							detail: g,
							p: {
								x: point.x,
								y: point.y
							}
						}
						return result;
					}
				}
			}
		}
			
		var result = {
			result: false
		}
		return result;
	},
	explosion: function(x,y,e1,e2) {
		game.es.reset();
		game.es.play();
		var frame = 0;
		var h = [60,56,63,52,45];
		var w = [60,57,63,53,46];
		var e = document.querySelector("#explosionFrame");
		var explosionBox = document.getElementById("explosionBox");
		var t1 = document.querySelector("#tankA" + e1) || document.querySelector(e1) || e1 || false;
		var t2 = document.querySelector("#tankB" + e2) || document.querySelector(e2) || e2 || false;
		
		if (t1) {
			animate.fadeout(t1, 0.75, 0.2);
		}
		if (t2) {
			animate.fadeout(t2, 0.75, 0.2);
		}
		
		var i = setInterval(function() {
			if (frame > 5) {
				clearInterval(i);
				e.className = "";
				return;
			}
			e.className = "bg-explosionSmoke" + (frame + 1);
			explosionBox.style.left = (x - (w[frame]/2)) + "px";
			explosionBox.style.bottom = (y - (h[frame]/2)) + "px";
			frame++;
		}, 90);
	},
	checkForGameEnd: function() {
		if ((!game.primaryTankDisabled && !game.player1.tanks[0] && !game.player2.tanks[0]) || (game.primaryTankDisabled && game.player1.tanks.toString().length == game.player1.n - 1 && game.player2.tanks.toString().length == game.player2.n - 1)) {
			game.pauseDisabled = true;
			clearInterval(game.interval);
			delete game.interval;
			var reset = setTimeout(function() { game.reset() }, 4000);
			var r = "tie";
			game.round++;
		} else if ((!game.player1.tanks[0] && !game.primaryTankDisabled) || (game.walls[0] && game.walls[0].destroyed)) {
			game.player2.score++;
			game.pauseDisabled = true;
			clearInterval(game.interval);
			delete game.interval;
			var reset = setTimeout(function() { game.reset() }, 4000);
			var r = "p2";
			game.round++;
		} else if ((!game.player2.tanks[0] && !game.primaryTankDisabled) || (game.walls[1] && game.walls[1].destroyed)) {
			game.player1.score++;
			game.pauseDisabled = true;
			clearInterval(game.interval);
			delete game.interval;
			var reset = setTimeout(function() { game.reset() }, 4000);
			var r = "p1";
			game.round++;
		}
		
		if (game.player1.score >= game.scoreLimit || game.player2.score >= game.scoreLimit) {
			clearTimeout(reset);
			game.ended = true;
			var s = html.style;
			if (game.player1.score >= game.scoreLimit) {
				game.message("PLAYER 1 IS VICTORIOUS!", 10);
				s.backgroundColor = game.player1.color;
				score.style.backgroundColor = game.player1.altcolor;
				game.pauseDisabled = true;
			} else {
				game.message("PLAYER 2 IS VICTORIOUS!", 10);
				s.backgroundColor = game.player2.color;
				score.style.backgroundColor = game.player2.altcolor;
				game.pauseDisabled = true;
			}
			document.querySelector(".boostFrame1").style.display = "none";
			document.querySelector(".boostFrame2").style.display = "none";
			background.stop();
		} else if (r == "tie") {
			game.message("TIE!", 4);
		} else if (r == "p2") {
			game.message("PLAYER 2 WINS!", 4);
		} else if (r == "p1") {
			game.message("PLAYER 1 WINS!", 4);
		}
		
		
	},
	updateScore: function() {
		if (document.getElementById("p1")) {
			p1.innerHTML = game.player1.score;
			p2.innerHTML = game.player2.score;
		}
	},
	message: function(m, t) {
		//Make t -1 to continue indefinately
		if (game.isMessaging) {
			clearInterval(game.messageInterval);
		}
		var d = true;
		score.innerHTML = m;
		
		game.messageInterval = setInterval(function() {
		switch (d) {
			case true:
				score.style.display = "none";
				d = false;
				break;
			case false:
				score.style.display = "block";
				d = true;
				break;
		}
		}, 500);
		game.isMessaging = true;
		if (t != -1) {
			setTimeout(function() {
				score.style.display = "block";
				clearInterval(game.messageInterval);
				game.isMessaging = false;
				score.innerHTML = '<p id="p1"></p>:<p id="p2"></p>';
				game.updateScore();
			}, t * 1000);
		}
	},
	keydownhandler: function(e) {
		var kC = e.keyCode;
		if (!game.keys[kC]) {
			game.keys[kC] = true;
			html.dispatchEvent(new CustomEvent("keyhold", { detail: kC }));
		}
		//console.log(kC);
	}
}
tn1.volume = 0.7;
tn2.volume = 0.7;

document.getElementById("gameFrame").style.width = game.area.width + "px";
document.getElementById("gameFrame").style.height = game.area.height + "px";

document.querySelector(".boostFrame1 .loadingBar").style.backgroundColor = game.player1.color;
document.querySelector(".boostFrame2 .loadingBar").style.backgroundColor = game.player2.color;

document.getElementById("score").onclick = function() {
	game.player1.score = 0;
	game.player2.score = 0;
	game.updateScore();
}



const cl = console.log;
const html = document.querySelector("html");
loadingFinished();