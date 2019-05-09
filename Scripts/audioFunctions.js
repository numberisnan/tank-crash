HTMLAudioElement.prototype.loopAudio = function(p) {
	if (p != "current") {
		this.currentTime = p * 1000 || 0;
	}
	this.play();
	this.onended = function() {
		this.currentTime = p * 1000 || 0;
		this.play();
	}
}

HTMLAudioElement.prototype.cancelLoopAudio = function() {
	this.onended = function() {}
	this.stop();
}

HTMLAudioElement.prototype.stop = function() {
	this.pause();
	this.reset();
}

HTMLAudioElement.prototype.reset = function() {
	this.currentTime = 0;
}