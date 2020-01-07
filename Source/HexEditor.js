
let bytes
let finalNibble = ""
let categoryMIME = "image"
let typeMIME = " "

function domElementUpdate()	{
  let textareaHexadecimal = document.querySelector('textarea')
	var bytesAsStringHexadecimal = Converter.bytesToStringHexadecimal(bytes);
	textareaHexadecimal.value = bytesAsStringHexadecimal + finalNibble;
}

function buttonSave_Clicked() {
	var dataAsArrayBuffer = new ArrayBuffer(bytes.length);
	var dataAsArrayUnsigned = new Uint8Array(dataAsArrayBuffer);
	for (var i = 0; i < bytes.length; i++) {
		dataAsArrayUnsigned[i] = bytes[i];
	}
	var dataAsBlob = new Blob([dataAsArrayBuffer], {type:'bytes'});

	var link = document.createElement("a");
	link.href = window.URL.createObjectURL(dataAsBlob);
	link.download = "glitched.jpeg";
	link.click();
}

function inputFileToLoad_Changed(event) {
	var inputFileToLoad = event.target;
	var fileToLoad = inputFileToLoad.files[0];
	if (fileToLoad != null) {
    let arrayMIMEString = fileToLoad.type.split('/')
    categoryMIME = arrayMIMEString[0]
    typeMIME = arrayMIMEString[1]
		var fileReader = new FileReader();
		fileReader.onload = inputFileToLoad_Changed_Loaded.bind(this);
		fileReader.readAsBinaryString(fileToLoad);
	}
}

function inputFileToLoad_Changed_Loaded(fileLoadedEvent) {
	var dataAsBinaryString = fileLoadedEvent.target.result;
  // let files = fileLoadedEvent.target.files

	bytes = [];

	for (var i = 0; i < dataAsBinaryString.length; i++) {
		var byte = dataAsBinaryString.charCodeAt(i);
		bytes.push(byte);
	}

	var img = document.querySelector( "#jpeg" );
	img.src = `data:${categoryMIME}/${typeMIME};base64, ${btoa(dataAsBinaryString)}`;

	domElementUpdate();
}

function textareaHexadecimal_Changed(event) {
	var bytesAsStringHexadecimal = event.target.value;
	bytes = Converter.stringHexadecimalToBytes(bytesAsStringHexadecimal);

	if (bytesAsStringHexadecimal.length % 2 == 0) {
		finalNibble = "";
	}
	else {
		finalNibble = bytesAsStringHexadecimal.substr(bytesAsStringHexadecimal.length - 1, 1);

		var finalNibbleAsInt = parseInt(finalNibble, 16);
		if (isNaN(finalNibbleAsInt) == true) {
			finalNibble = "";
		}
	}

  debounce(imgElementUpdate, 400)();
}

function imgElementUpdate() {
  debugger
	var dataAsArrayBuffer = new ArrayBuffer(bytes.length);
  var dataAsArrayUnsigned = new Uint8Array(dataAsArrayBuffer);
	for (var i = 0; i < bytes.length; i++)
	{
		dataAsArrayUnsigned[i] = bytes[i];
	}
	// var dataAsBlob = new Blob([dataAsArrayBuffer],  { type: "image/jpeg" } );

  var dataAsUint8 = new Uint8Array(bytes);

  var dataAsBlob
  if (typeMIME==='jpeg') {
    dataAsBlob = new Blob([dataAsArrayBuffer],  { type: `${categoryMIME}/${typeMIME}` } );
  } else if (typeMIME==='png' || typeMIME==='gif'){
    dataAsBlob = new Blob([dataAsUint8],  { type: `${categoryMIME}/${typeMIME}` } );
  }

	var urlCreator = window.URL || window.webkitURL;
	var imageUrl = urlCreator.createObjectURL( dataAsBlob );
	var img = document.querySelector( "#jpeg" );
	img.src = imageUrl;
}
