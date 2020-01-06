
function textInputHandler(value) {
	let elm = document.querySelector('input.slider-input')
	elm.value = parseInt(value, 16);
}

function sliderInputHandler(value) {
	let elm = document.querySelector('input.text-input')
	elm.value = (+value).toString(16);
}

let timeout;
function debounce(callback, time) {
	return function() {
		var context = this;
		var args = arguments;
		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(function() {
			timeout = null;
			callback.apply(context, args);
		}, time);
	}
}
