var animate = {
	fadeout: function(element, time, f) {
		if (!time) {
			time = 1;
		}
		if (!f) {
			f = 0;
		}
		element.style.opacity = 1;
		element.style.transition = "opacity " + time + "s";
		element.style.opacity = f;
		if (f == 0) {
			setTimeout(function() { element.style.display = "none" }, time*1000);
		}
	},
	fadein: function(element, time) {
		if (!time) {
			time = 1;
		}
		element.style.opacity = 0;
		element.style.display = "block";
		element.style.transition = "opacity " + time + "s";
		element.style.opacity = 1;
	},
	slideout: function(element, direction, time) {
		var c = element.children;
		if (!time) {
			time = 1;
		}
		if (direction == 1) {
			element.style.transition = "bottom " + time + "s";
			for (var i = 0; i < element.children.length; i++) {
				element.children[i].style.transition = "bottom " + time + "s";
			}
			element.style.bottom = "100%";
			for (var i = 0; i < element.children.length; i++) {
				element.children[i].style.bottom = "100%";
			}
		} else if (direction == 2) {
			element.style.transition = "left " + time + "s";
			for (var i = 0; i < element.children.length; i++) {
				element.children[i].style.transition = "left " + time + "s";
			}
			element.style.left = "100%";
			for (var i = 0; i < element.children.length; i++) {
					element.children[i].style.left = "100%";
				}
		} else if (direction == 3) {
			element.style.transition = "top " + time + "s";
			for (var i = 0; i < element.children.length; i++) {
				element.children[i].style.transition = "top " + time + "s";
			}
			element.style.top = "100%";
			for (var i = 0; i < element.children.length; i++) {
					element.children[i].style.top = "100%";
				}
		} else {
			element.style.transition = "right " + time + "s";
			for (var i = 0; i < element.children.length; i++) {
				element.children[i].style.transition = "right " + time + "s";
			}
			element.style.right = "100%";
			for (var i = 0; i < element.children.length; i++) {
				element.children[i].style.right = "100%";
			}
		}
	},
	slidein: function(element, direction, time) {
		var c = element.children;
		if (!time) {
			time = 1;
		}
		if (direction == 1) {
			element.style.transition = "bottom " + time + "s";
			for (var i = 0; i < element.children.length; i++) {
				element.children[i].style.transition = "bottom " + time + "s";
			}
			element.style.bottom = "0";
			for (var i = 0; i < element.children.length; i++) {
				element.children[i].style.bottom = "0";
			}
		} else if (direction == 2) {
			element.style.transition = "left " + time + "s";
			for (var i = 0; i < element.children.length; i++) {
				element.children[i].style.transition = "left " + time + "s";
			}
			element.style.left = "0";
			for (var i = 0; i < element.children.length; i++) {
					element.children[i].style.left = "0";
				}
		} else if (direction == 3) {
			element.style.transition = "top " + time + "s";
			for (var i = 0; i < element.children.length; i++) {
				element.children[i].style.transition = "top " + time + "s";
			}
			element.style.top = "0";
			for (var i = 0; i < element.children.length; i++) {
					element.children[i].style.top = "0";
				}
		} else {
			element.style.transition = "right " + time + "s";
			for (var i = 0; i < element.children.length; i++) {
				element.children[i].style.transition = "right " + time + "s";
			}
			element.style.right = "0";
			for (var i = 0; i < element.children.length; i++) {
				element.children[i].style.right = "0";
			}
		}
	}
}

