
function Session(bytes)
{
	this.bytes = bytes;
	this.finalNibble = "";
}
{
	// dom

	Session.prototype.domElementUpdate = function()	{
		var nibblesPerRow = 64;
		var bytesPerRow = nibblesPerRow / 2;

		if (this.domElement == null) {
			var d = document;

			var divSession = d.createElement("div");

			var rowCount = 32;

			var textareaHexadecimal = d.createElement("textarea");
			textareaHexadecimal.rows = rowCount;
			textareaHexadecimal.onkeyup = this.textareaHexadecimal_KeyUp.bind(this);
			textareaHexadecimal.oninput = this.textareaHexadecimal_Changed.bind(this);
			textareaHexadecimal.style.resize = "none";
			textareaHexadecimal.spellcheck = false;
			this.textareaHexadecimal = textareaHexadecimal;
			divSession.appendChild(textareaHexadecimal);

			var divFileOperations = d.createElement("div");

			var buttonSave = d.createElement("button");
			buttonSave.innerHTML = "Save";
			buttonSave.onclick = this.buttonSave_Clicked.bind(this);
			divFileOperations.appendChild(buttonSave);

			var inputFileToLoad = d.createElement("input");
			inputFileToLoad.type = "file";
			inputFileToLoad.onchange = this.inputFileToLoad_Changed.bind(this);
			divFileOperations.appendChild(inputFileToLoad);

			divSession.appendChild(divFileOperations);

			var divMain = d.getElementById("divMain");
			divMain.appendChild(divSession);

			this.domElement = divSession;
		}

		var textareaHexadecimalWidthInColumns = nibblesPerRow - 1; // Not sure why -1 is needed.
		if (this.textareaHexadecimal.scrollHeight > this.textareaHexadecimal.clientHeight) {
			var scrollbarWidthInChars = 2;  // May be 3 on some systems?
			textareaHexadecimalWidthInColumns += scrollbarWidthInChars;
		}
		this.textareaHexadecimal.cols = textareaHexadecimalWidthInColumns;

		var bytesAsStringHexadecimal = Converter.bytesToStringHexadecimal(this.bytes);
		this.textareaHexadecimal.value = bytesAsStringHexadecimal + this.finalNibble;

		return this.domElement;
	}

	// events

	Session.prototype.buttonSave_Clicked = function() {
		var dataAsArrayBuffer = new ArrayBuffer(this.bytes.length);
		var dataAsArrayUnsigned = new Uint8Array(dataAsArrayBuffer);
		for (var i = 0; i < this.bytes.length; i++) {
			dataAsArrayUnsigned[i] = this.bytes[i];
		}
		var dataAsBlob = new Blob([dataAsArrayBuffer], {type:'bytes'});

		var link = document.createElement("a");
		link.href = window.URL.createObjectURL(dataAsBlob);
		link.download = "glitched.jpeg";
		link.click();
	}

	Session.prototype.inputFileToLoad_Changed = function(event) {

		var inputFileToLoad = event.target;
		var fileToLoad = inputFileToLoad.files[0];
		if (fileToLoad != null) {
			var fileReader = new FileReader();
			fileReader.onload = this.inputFileToLoad_Changed_Loaded.bind(this);
			fileReader.readAsBinaryString(fileToLoad);
		}
	}

	Session.prototype.inputFileToLoad_Changed_Loaded = function(fileLoadedEvent) {
		var dataAsBinaryString = fileLoadedEvent.target.result;

		this.bytes = [];

		for (var i = 0; i < dataAsBinaryString.length; i++) {
			var byte = dataAsBinaryString.charCodeAt(i);
			if (i === 0) {
				sliderInputHandler(byte)
				textInputHandler(byte)
			}
			this.bytes.push(byte);
		}

		var img = document.querySelector( "#jpeg" );
		img.src = "data:image/jpeg;base64," + btoa(dataAsBinaryString);

		this.domElementUpdate();
	}

	Session.prototype.textareaHexadecimal_Changed = function(event) {
		var bytesAsStringHexadecimal = event.target.value;
		this.bytes = Converter.stringHexadecimalToBytes(bytesAsStringHexadecimal);

		if (bytesAsStringHexadecimal.length % 2 == 0) {
			this.finalNibble = "";
		}
		else {
			this.finalNibble = bytesAsStringHexadecimal.substr(bytesAsStringHexadecimal.length - 1, 1);

			var finalNibbleAsInt = parseInt(this.finalNibble, 16);
			if (isNaN(finalNibbleAsInt) == true) {
				this.finalNibble = "";
			}
		}

		this.imgElementUpdate();

		this.domElementUpdate();
	}

	Session.prototype.imgElementUpdate = function() {
		var dataAsArrayBuffer = new ArrayBuffer(this.bytes.length);
		var dataAsArrayUnsigned = new Uint8Array(dataAsArrayBuffer);
		for (var i = 0; i < this.bytes.length; i++)
		{
			dataAsArrayUnsigned[i] = this.bytes[i];
		}
		var dataAsBlob = new Blob([dataAsArrayBuffer],  { type: "image/jpeg" } );

		var urlCreator = window.URL || window.webkitURL;
		var imageUrl = urlCreator.createObjectURL( dataAsBlob );
		var img = document.querySelector( "#jpeg" );
		img.src = imageUrl;
	}

	Session.prototype.textareaHexadecimal_KeyUp = function(event) {
		var keyName = event.key;
		if (keyName.startsWith("Arrow") || keyName == "Home" || keyName == "End") {
			this.domElementUpdate();
		}
	}
}

function textInputHandle(value) {
	let elm = document.querySelector('input.slider-input')
	elm.value = parseInt(value, 16);
}

function sliderInputHandler(value) {
	let elm = document.querySelector('input.text-input')
	elm.value = (+value).toString(16);
}
