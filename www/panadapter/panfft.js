var canvas_width_SP=document.getElementById("cansp").width;
var canvas_height_SP=document.getElementById("cansp").height;
var canvas_width_WF=document.getElementById("canwf").width;
var canvas_height_WF=document.getElementById("canwf").height;
var wshFFT = "";
var zoom_FFT=100;
var samplerate = "960000";
var FFTSIZE = 4096;
var localcenterfrequency=0;
var freqmouse=0;

var FFT_Viso_Dynamic=50
var FFT_Viso_min=-180


const visual_CenterFrequency = document.getElementById("div-CenterFrequency");
const visual_SampleRate = document.getElementById("div-SampleRate");
const visual_FFtResolution = document.getElementById("div-FFtResolution");
const visual_freq = document.getElementById("div-mouseFrequency");
const visual_WindowsZoom = document.getElementById("div-WindowsZoom");

const canvasSP = document.getElementById("cansp");
const canvasWF = document.getElementById("canwf")

function bodyload(){ 
	initFFT();
	startFFT();
}

function set_FFT_Viso_Dynamic(v){FFT_Viso_Dynamic=v;}
function set_FFT_Viso_min(v){FFT_Viso_min=v;}




function startFFT(){ 
	document.getElementById("div-scoketscontrols").innerHTML='<img src="img/critsgrey.png">wsFFT';
	wshFFT = new WebSocket( 'wss://' + window.location.href.split( '/' )[2] + '/WSpanFFT' );
	wshFFT.onopen = appendwshFFTOpen;
	wshFFT.onmessage = init_showFFT;
	wshFFT.onerror = appendwshFFTError;
	wshFFT.onclose = appendwshFFTclose;
}

function appendwshFFTclose(){
	document.getElementById("div-scoketscontrols").innerHTML='<img src="img/critsred.png">wsFFT';
}

function appendwshFFTOpen(){
	document.getElementById("div-scoketscontrols").innerHTML='<img src="img/critsgreen.png">wsFFT';
	wshFFT.send("init");
}

function appendwshFFTError(err){
	document.getElementById("div-scoketscontrols").innerHTML='<img src="img/critsred.png">wsFFT';
    wshFFT.close();
	startFFT();
}

function stopFFT(){ 
	wshFFT.close();
	initFFT();
}

function initFFT(){ 
	initCanvas("cansp");
	initCanvas("canwf");
}

var globmsg = "";



function init_showFFT( msg ){ 
	datas = msg.data.split(':');
	if(datas[0] == "fftsr"){
		samplerate=datas[1];
	}
	else if(datas[0] == "fftsz"){
		FFTSIZE=parseInt(datas[1]);
		canvasSP.width=parseInt(FFTSIZE);
		canvasWF.width=parseInt(FFTSIZE);
		var canvas_width_SP=document.getElementById("cansp").width;
		var canvas_height_SP=document.getElementById("cansp").height;
		var canvas_width_WF=document.getElementById("canwf").width;
		var canvas_height_WF=document.getElementById("canwf").height;
	}
	else if(datas[0] == "fftst"){
		visual_SampleRate.innerHTML = samplerate+"sps";
		visual_FFtResolution.innerHTML=samplerate/FFTSIZE+"hz/px";
		wshFFT.send("ready");
		window.opener.ControlTRX_getFreq();
		wshFFT.binaryType = 'arraybuffer';
		wshFFT.onmessage = showFFT;
	}
}

function showFFT( msg ){ 
	var buffer = new Uint8Array(msg.data);
	let FFTdata = buffer.subarray(0, FFTSIZE);
	FFTdata_scale_min = ((buffer[FFTSIZE] << 8) + (buffer[FFTSIZE+1]))-65280;
	FFTdata_scale_max= ((buffer[FFTSIZE+2] << 8) + (buffer[FFTSIZE+3]))-65280;
	
	min_Factor=FFTdata_scale_min-FFT_Viso_min;
	max_Factor=(FFTdata_scale_max-FFTdata_scale_min)/FFT_Viso_Dynamic;
	
	SetImageDataWF(FFTdata,min_Factor,max_Factor);
	SetImageDataSP(FFTdata,min_Factor,max_Factor);
}


const ctxSP = canvasSP.getContext("2d");// imgObjSP = ctxSP.createImageData(canvasSP.width, canvas_height);	
const midle_SP = canvas_width_SP*2;

function SetImageDataSP(datas,scale_min,scale_max) {
	imgObjSP = new ImageData(canvasSP.width, canvas_height_SP);
	let i = 0;
	for(let Line = 0; Line < canvas_height_SP; Line++){
		i = 4*(Line * canvas_width_SP);
		y = canvas_height_SP - Line;
		for (let px = 0; px < canvas_width_SP; px++) {
			let dat = (datas[px]*scale_max + scale_min);
			if(y <= dat){
			//imgObjSP.data[i] = 0;   // red
			imgObjSP.data[++i] = 215; // green
			imgObjSP.data[++i] = 233; // blue
			imgObjSP.data[++i] = 255; // alpha
			++i;
			}
			else{i += 4 ;}
		}
		i -= midle_SP ;
		//imgObjSP.data[i] = 0;   // red
		imgObjSP.data[++i] = 255; // green
		imgObjSP.data[++i] = 0; // blue
		imgObjSP.data[++i] = 255; // alpha
	}
	ctxSP.putImageData(imgObjSP, 0, 0);
}

const ctxWF = canvasWF.getContext("2d"),imgObjWF = ctxWF.createImageData(canvasWF.width, 1);
//const	colMap = [[0,0,0,255],[40,0,0,255],[56,0,4,255],[61,0,9,255],[64,0,12,255],[66,0,14,255],[69,0,17,255],[73,0,20,255],[74,0,22,255],[78,0,25,255],[79,0,27,255],[83,0,30,255],[85,0,31,255],[86,0,33,255],[90,0,36,255],[91,0,38,255],[93,0,39,255],[95,0,41,255],[96,0,43,255],[100,0,46,255],[102,0,47,255],[103,0,49,255],[105,0,51,255],[107,0,52,255],[108,0,54,255],[110,0,55,255],[112,0,57,255],[112,0,57,255],[113,0,58,255],[115,0,60,255],[117,0,62,255],[119,0,63,255],[120,0,65,255],[122,0,66,255],[124,0,68,255],[125,0,70,255],[127,0,71,255],[129,0,73,255],[129,0,73,255],[130,0,74,255],[132,0,76,255],[134,0,78,255],[136,0,79,255],[137,0,81,255],[139,0,82,255],[141,0,84,255],[142,0,86,255],[144,0,87,255],[146,0,89,255],[147,0,90,255],[149,0,92,255],[151,0,94,255],[151,0,94,255],[153,0,95,255],[154,0,97,255],[156,0,98,255],[158,0,100,255],[159,0,102,255],[161,0,103,255],[163,0,105,255],[164,0,106,255],[166,0,108,255],[168,0,109,255],[170,0,111,255],[171,0,113,255],[173,0,114,255],[175,0,116,255],[176,0,117,255],[178,0,119,255],[180,0,121,255],[180,0,121,255],[181,0,122,255],[183,0,124,255],[185,0,125,255],[187,0,127,255],[188,0,129,255],[190,0,130,255],[192,0,132,255],[193,0,133,255],[195,0,135,255],[197,0,137,255],[198,0,138,255],[200,0,140,255],[202,0,141,255],[204,0,143,255],[204,0,143,255],[205,0,145,255],[207,0,146,255],[209,0,148,255],[210,0,149,255],[212,0,151,255],[214,0,153,255],[215,0,154,255],[217,0,156,255],[219,0,157,255],[221,0,159,255],[222,0,160,255],[222,0,160,255],[224,0,162,255],[226,0,164,255],[227,0,165,255],[229,0,167,255],[231,0,168,255],[232,0,170,255],[234,0,172,255],[236,0,173,255],[238,0,175,255],[238,0,175,255],[239,0,176,255],[241,0,178,255],[243,0,180,255],[244,0,181,255],[246,0,183,255],[248,2,184,255],[249,4,186,255],[249,4,186,255],[249,4,186,255],[251,6,188,255],[251,6,188,255],[253,9,189,255],[253,9,189,255],[255,11,191,255],[255,11,191,255],[255,13,192,255],[255,13,192,255],[255,13,192,255],[255,16,194,255],[255,18,196,255],[255,20,197,255],[255,20,197,255],[255,23,199,255],[255,25,200,255],[255,27,202,255],[255,30,204,255],[255,32,205,255],[255,34,207,255],[255,37,208,255],[255,37,208,255],[255,39,210,255],[255,41,211,255],[255,44,213,255],[255,46,215,255],[255,48,216,255],[255,51,218,255],[255,53,219,255],[255,53,219,255],[255,55,221,255],[255,57,223,255],[255,60,224,255],[255,62,226,255],[255,64,227,255],[255,67,229,255],[255,67,229,255],[255,69,231,255],[255,71,232,255],[255,74,234,255],[255,76,235,255],[255,78,237,255],[255,81,239,255],[255,81,239,255],[255,83,240,255],[255,85,242,255],[255,88,243,255],[255,90,245,255],[255,92,247,255],[255,95,248,255],[255,95,248,255],[255,97,250,255],[255,99,251,255],[255,102,253,255],[255,104,255,255],[255,106,255,255],[255,106,255,255],[255,108,255,255],[255,111,255,255],[255,113,255,255],[255,115,255,255],[255,115,255,255],[255,118,255,255],[255,120,255,255],[255,122,255,255],[255,122,255,255],[255,125,255,255],[255,127,255,255],[255,129,255,255],[255,129,255,255],[255,132,255,255],[255,134,255,255],[255,136,255,255],[255,136,255,255],[255,139,255,255],[255,141,255,255],[255,143,255,255],[255,143,255,255],[255,146,255,255],[255,148,255,255],[255,150,255,255],[255,150,255,255],[255,153,255,255],[255,155,255,255],[255,155,255,255],[255,157,255,255],[255,159,255,255],[255,159,255,255],[255,162,255,255],[255,164,255,255],[255,164,255,255],[255,166,255,255],[255,169,255,255],[255,171,255,255],[255,171,255,255],[255,173,255,255],[255,176,255,255],[255,176,255,255],[255,178,255,255],[255,180,255,255],[255,180,255,255],[255,183,255,255],[255,185,255,255],[255,185,255,255],[255,187,255,255],[255,190,255,255],[255,190,255,255],[255,192,255,255],[255,194,255,255],[255,197,255,255],[255,197,255,255],[255,199,255,255],[255,201,255,255],[255,204,255,255],[255,204,255,255],[255,206,255,255],[255,208,255,255],[255,210,255,255],[255,210,255,255],[255,213,255,255],[255,215,255,255],[255,217,255,255],[255,217,255,255],[255,220,255,255],[255,222,255,255],[255,224,255,255],[255,227,255,255],[255,229,255,255],[255,229,255,255],[255,231,255,255],[255,234,255,255],[255,236,255,255],[255,238,255,255],[255,241,255,255],[255,243,255,255],[255,243,255,255],[255,245,255,255],[255,248,255,255],[255,250,255,255],[255,255,255,255]];
const colMap = [[0,0,127,255],[0,0,131,255],[0,0,135,255],[0,0,139,255],[0,0,143,255],[0,0,147,255],[0,0,151,255],[0,0,155,255],[0,0,159,255],[0,0,163,255],[0,0,167,255],[0,0,171,255],[0,0,175,255],[0,0,179,255],[0,0,183,255],[0,0,187,255],[0,0,191,255],[0,0,195,255],[0,0,199,255],[0,0,203,255],[0,0,207,255],[0,0,211,255],[0,0,215,255],[0,0,219,255],[0,0,223,255],[0,0,227,255],[0,0,231,255],[0,0,235,255],[0,0,239,255],[0,0,243,255],[0,0,247,255],[0,0,251,255],[0,0,255,255],[0,4,255,255],[0,8,255,255],[0,12,255,255],[0,16,255,255],[0,20,255,255],[0,24,255,255],[0,28,255,255],[0,32,255,255],[0,36,255,255],[0,40,255,255],[0,44,255,255],[0,48,255,255],[0,52,255,255],[0,56,255,255],[0,60,255,255],[0,64,255,255],[0,68,255,255],[0,72,255,255],[0,76,255,255],[0,80,255,255],[0,84,255,255],[0,88,255,255],[0,92,255,255],[0,96,255,255],[0,100,255,255],[0,104,255,255],[0,108,255,255],[0,112,255,255],[0,116,255,255],[0,120,255,255],[0,124,255,255],[0,128,255,255],[0,132,255,255],[0,136,255,255],[0,140,255,255],[0,144,255,255],[0,148,255,255],[0,152,255,255],[0,156,255,255],[0,160,255,255],[0,164,255,255],[0,168,255,255],[0,172,255,255],[0,176,255,255],[0,180,255,255],[0,184,255,255],[0,188,255,255],[0,192,255,255],[0,196,255,255],[0,200,255,255],[0,204,255,255],[0,208,255,255],[0,212,255,255],[0,216,255,255],[0,220,255,255],[0,224,255,255],[0,228,255,255],[0,232,255,255],[0,236,255,255],[0,240,255,255],[0,244,255,255],[0,248,255,255],[0,252,255,255],[1,255,253,255],[5,255,249,255],[9,255,245,255],[13,255,241,255],[17,255,237,255],[21,255,233,255],[25,255,229,255],[29,255,225,255],[33,255,221,255],[37,255,217,255],[41,255,213,255],[45,255,209,255],[49,255,205,255],[53,255,201,255],[57,255,197,255],[61,255,193,255],[65,255,189,255],[69,255,185,255],[73,255,181,255],[77,255,177,255],[81,255,173,255],[85,255,169,255],[89,255,165,255],[93,255,161,255],[97,255,157,255],[101,255,153,255],[105,255,149,255],[109,255,145,255],[113,255,141,255],[117,255,137,255],[121,255,133,255],[125,255,129,255],[129,255,125,255],[133,255,121,255],[137,255,117,255],[141,255,113,255],[145,255,109,255],[149,255,105,255],[153,255,101,255],[157,255,97,255],[161,255,93,255],[165,255,89,255],[169,255,85,255],[173,255,81,255],[177,255,77,255],[181,255,73,255],[185,255,69,255],[189,255,65,255],[193,255,61,255],[197,255,57,255],[201,255,53,255],[205,255,49,255],[209,255,45,255],[213,255,41,255],[217,255,37,255],[221,255,33,255],[225,255,29,255],[229,255,25,255],[233,255,21,255],[237,255,17,255],[241,255,13,255],[245,255,9,255],[249,255,5,255],[253,255,1,255],[255,252,0,255],[255,248,0,255],[255,244,0,255],[255,240,0,255],[255,236,0,255],[255,232,0,255],[255,228,0,255],[255,224,0,255],[255,220,0,255],[255,216,0,255],[255,212,0,255],[255,208,0,255],[255,204,0,255],[255,200,0,255],[255,196,0,255],[255,192,0,255],[255,188,0,255],[255,184,0,255],[255,180,0,255],[255,176,0,255],[255,172,0,255],[255,168,0,255],[255,164,0,255],[255,160,0,255],[255,156,0,255],[255,152,0,255],[255,148,0,255],[255,144,0,255],[255,140,0,255],[255,136,0,255],[255,132,0,255],[255,128,0,255],[255,124,0,255],[255,120,0,255],[255,116,0,255],[255,112,0,255],[255,108,0,255],[255,104,0,255],[255,100,0,255],[255,96,0,255],[255,92,0,255],[255,88,0,255],[255,84,0,255],[255,80,0,255],[255,76,0,255],[255,72,0,255],[255,68,0,255],[255,64,0,255],[255,60,0,255],[255,56,0,255],[255,52,0,255],[255,48,0,255],[255,44,0,255],[255,40,0,255],[255,36,0,255],[255,32,0,255],[255,28,0,255],[255,24,0,255],[255,20,0,255],[255,16,0,255],[255,12,0,255],[255,8,0,255],[255,4,0,255],[255,0,0,255],[251,0,0,255],[247,0,0,255],[243,0,0,255],[239,0,0,255],[235,0,0,255],[231,0,0,255],[227,0,0,255],[223,0,0,255],[219,0,0,255],[215,0,0,255],[211,0,0,255],[207,0,0,255],[203,0,0,255],[199,0,0,255],[195,0,0,255],[191,0,0,255],[187,0,0,255],[183,0,0,255],[179,0,0,255],[175,0,0,255],[171,0,0,255],[167,0,0,255],[163,0,0,255],[159,0,0,255],[155,0,0,255],[151,0,0,255],[147,0,0,255],[143,0,0,255],[139,0,0,255],[135,0,0,255],[131,0,0,255],[127,0,0,255]];
const midle_WF = canvas_width_WF*2;

function SetImageDataWF(datas,scale_min,scale_max) {
	var canvasBuffer = document.createElement("canvas");
	canvasBuffer.width = canvas_width_WF;
	canvasBuffer.height = canvas_height_WF;
	var ctxBuffer = canvasBuffer.getContext("2d");
	
	ctxBuffer.clearRect(0,0,canvas_width_WF,canvas_height_WF); //clear buffer
	ctxBuffer.drawImage(canvasWF,0,0); //store display data in buffer
	ctxWF.clearRect(0,0,canvas_width_WF,canvas_height_WF); //clear display
	ctxWF.drawImage(canvasBuffer,0,1); //copy buffer to display
		

	var px=0;
	var i=0;
    for (px = 0; px < canvas_width_WF; px++) {
		i = 4*px;

		let dat = Math.floor(datas[px]*scale_max + scale_min);
		
		if(dat<0){dat=0;}
		if(dat>255){dat=255;}
		
		// let rgba = colMap[datas[px]];  // lookup color rgba values
		imgObjWF.data[i] = colMap[dat][0];   // red
		imgObjWF.data[i+1] = colMap[dat][1]; // green
		imgObjWF.data[i+2] = colMap[dat][2]; // blue
		imgObjWF.data[i+3] = colMap[dat][3]; // alpha
	}
	
	imgObjWF.data[midle_WF] = 0;   
	imgObjWF.data[midle_WF+1] = 255;
	imgObjWF.data[midle_WF+2] = 0; 
	imgObjWF.data[midle_WF+3] = 255; 

	ctxWF.putImageData(imgObjWF, 0, 0);

}



function initCanvas(cvsIDwf) {	
	var canvas = document.getElementById(cvsIDwf);
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "black"; 
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
   canvas.addEventListener('wheel', (event) => {
		set_FFT_zoom();
        event.stopImmediatePropagation(); // WORKED!!
    }, false)
	
	canvas.addEventListener('mousemove', showOnmouseInfo, false);
	
	canvas.addEventListener('mouseout', function(event) {visual_freq.innerHTML="&#8734;hz";}, false);
	
	canvas.addEventListener('click', function() {window.opener.sendTRXfreq(freqmouse);}, false);
	
}


function showOnmouseInfo(event) {
		var rect = this.getBoundingClientRect()
		var scaleX = this.width / rect.width;    // relationship bitmap vs. element for X 
		var hzperpixel=samplerate/this.width;
		// console.log(this.width);
		// console.log(rect.width);
		
		hz=((window.scrollX+event.clientX)*scaleX*hzperpixel)-(samplerate/2);
		freqmouse=window.opener.TRXfrequency+hz;
		//var scale_hz = Math.exp(parseInt(document.getElementById("canBFFFT_scale_multhz").value)/100);
		// var start = (parseInt(document.getElementById("canBFFFT_scale_start").value)*Audio_analyser.frequencyBinCount/100)*scale_hz;
		
		// scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y
		// var scale_mult = Math.exp(parseInt(document.getElementById("canBFFFT_scale_multdb").value)/100);
		// var scale_floor = parseInt(document.getElementById("canBFFFT_scale_floor").value);
		
		// console.log(parseInt(((((evt.clientX - rect.left)/(scale_hz*scale_hz) * scaleX ) - (start/scale_hz))* (AudioRX_sampleRate/2))/canvasBFFFT.width) + 'hz ,-' + parseInt(((evt.clientY - rect.top) * scaleY)/(scale_mult) + (scale_floor))+'dB');
	//console.log(scaleX);
	//console.log(window.opener.TRXfrequency);
	//console.log(event.clientX);
	visual_freq.innerHTML=Math.floor(freqmouse)+"hz";
}


function set_FFT_zoom() {
	if(event.deltaY>0){
			if(zoom_FFT >= 150){zoom_FFT/=1.5;}
	}else{
		zoom_FFT*=1.5;
	}
	visual_WindowsZoom.innerHTML=canvasWF.style.width = canvasSP.style.width = zoom_FFT + "%";
	window.scroll((window.screen.width*(zoom_FFT/100)/2)-window.screen.width/2, 0);
	visual_FFtResolution.innerHTML=Math.floor(samplerate/FFTSIZE/(zoom_FFT/100))+"hz/px";
}


function setcenterfrequency (freq){
	localcenterfrequency=freq;
	visual_CenterFrequency.innerHTML=localcenterfrequency+"hz";;
}
