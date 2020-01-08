
let bytes
let categoryMIME = "image"
let typeMIME = " "

function domElementUpdate()	{
  let divHexadecimal = document.querySelector('.editable-div')
	let bytesAsStringHexadecimal = Converter.bytesToStringHexadecimal(bytes);
  divHexadecimal.innerText = bytesAsStringHexadecimal;

  let originalCharsSpanElm = document.querySelector('.original-chars span')
  let currentCharsSpanElm = document.querySelector('.current-chars span')
  originalCharsSpanElm.innerText = divHexadecimal.innerText.length
  currentCharsSpanElm.innerText = divHexadecimal.innerText.length
}

function buttonSave_Clicked() {
	let dataAsArrayBuffer = new ArrayBuffer(bytes.length);
	let dataAsArrayUnsigned = new Uint8Array(dataAsArrayBuffer);
	for (let i = 0; i < bytes.length; i++) {
		dataAsArrayUnsigned[i] = bytes[i];
	}
	let dataAsBlob = new Blob([dataAsArrayBuffer], {type:'bytes'});

	let link = document.createElement("a");
	link.href = window.URL.createObjectURL(dataAsBlob);
	link.download = "glitched.jpeg";
	link.click();
}

function inputFileToLoad_Changed(event) {
	let inputFileToLoad = event.target;
	let fileToLoad = inputFileToLoad.files[0];
	if (fileToLoad != null) {
    let arrayMIMEString = fileToLoad.type.split('/')
    categoryMIME = arrayMIMEString[0]
    typeMIME = arrayMIMEString[1]
		let fileReader = new FileReader();
		fileReader.onload = inputFileToLoad_Changed_Loaded.bind(this);
		fileReader.readAsBinaryString(fileToLoad);
	}
}

function inputFileToLoad_Changed_Loaded(fileLoadedEvent) {
	let dataAsBinaryString = fileLoadedEvent.target.result;
  // let files = fileLoadedEvent.target.files

  bytes = [];

	for (let i = 0; i < dataAsBinaryString.length; i++) {
		let byte = dataAsBinaryString.charCodeAt(i);
    bytes.push(byte);
	}

  let img = document.querySelector( "#jpeg" );
  img.src = `data:${categoryMIME}/${typeMIME};base64, ${btoa(dataAsBinaryString)}`;

	domElementUpdate();
}

function textareaHexadecimal_Changed(event) {
  // console.log((/[A-Fa-f0-9]/).test(event.key));
  if (!(/[A-Fa-f0-9]/).test(event.key)) {
    event.preventDefault()
    return
  }

	let bytesAsStringHexadecimal = event.target.innerText;
  let currentCharsSpanElm = document.querySelector('.current-chars span')
  currentCharsSpanElm.innerText = bytesAsStringHexadecimal.length

	bytes = Converter.stringHexadecimalToBytes(bytesAsStringHexadecimal);

  debounce(imgElementUpdate, 400)();
}

function imgElementUpdate() {
	let dataAsArrayBuffer = new ArrayBuffer(bytes.length);
  let dataAsArrayUnsigned = new Uint8Array(dataAsArrayBuffer);
	for (let i = 0; i < bytes.length; i++)
	{
		dataAsArrayUnsigned[i] = bytes[i];
	}

  let dataAsUint8 = new Uint8Array(bytes);

  let dataAsBlob
  if (typeMIME==='jpeg') {
    dataAsBlob = new Blob([dataAsArrayBuffer],  { type: `${categoryMIME}/${typeMIME}` } );
  } else if (typeMIME==='png' || typeMIME==='gif'){
    dataAsBlob = new Blob([dataAsUint8],  { type: `${categoryMIME}/${typeMIME}` } );
  }

	let urlCreator = window.URL || window.webkitURL;
	let imageUrl = urlCreator.createObjectURL( dataAsBlob );
	let img = document.querySelector( "#jpeg" );
	img.src = imageUrl;
}
