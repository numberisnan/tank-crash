//Array functions
//Shuffle an array, returns new shuffled array
function arrayShuffle(a) {
	const oldarray = a.slice(0);
	var choices = oldarray;
	if (oldarray.length <= 1) {
		return;
	}
	var newarray = [];
	
	while (newarray.length < oldarray.length) {
		do {
			var choice = Math.floor(Math.random() * oldarray.length);
		}
		while (!choices[choice])
		newarray.push(choices[choice]);
		delete choices[choice];
	}
	
	return newarray;
}