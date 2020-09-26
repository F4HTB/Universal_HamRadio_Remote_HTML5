//Extra Generals///////////////////////////////////////////////////////////////////////////

//document.addEventListener('contextmenu', event => event.preventDefault());
function bodyload(){
	disableScroll();
}

function disableScroll() { 
    // Get the current page scroll position 
    scrollTop = window.pageYOffset || document.documentElement.scrollTop; 
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft, 
  
        // if any scroll is attempted, set this to the previous value 
        window.onscroll = function() { 
            window.scrollTo(scrollLeft, scrollTop); 
        }; 
}

//Generals routines///////////////////////////////////////////////////////////////////////////
poweron = false;
function powertogle()
{
	if(event.srcElement.src.replace(/^.*[\\\/]/, '')=="poweroff.png"){
		event.srcElement.src="img/poweron.png";
		
		document.getElementById("ombre-body").style.display = "block";
		document.getElementById("pop-upspinner").style.display = "block";
		check_connected();
		
		AudioRX_start();
		ControlTRX_start();
		
		checklatency();
		
		poweron = true;
	}
	else{
		event.srcElement.src="img/poweroff.png";
		AudioRX_stop();
		ControlTRX_stop();
		
		poweron = false;
	}
}

function check_connected() {
	setTimeout(function () {
		if (wsAudioRX.readyState === WebSocket.OPEN && wsControlTRX.readyState === WebSocket.OPEN){document.getElementById("ombre-body").style.display = "none";document.getElementById("pop-upspinner").style.display = "none";}
		else{check_connected();}
	}, 1000);
}

//RX Audio routines///////////////////////////////////////////////////////////////////////////

var wsAudioRX = "";
var AudioRX_context = "";
var AudioRX_source_node = "";
var audiobufferready = false;

function AudioRX_start(){
	document.getElementById("indwsAudioRX").innerHTML='<img src="img/critsgrey.png">wsRX';
	var audiobuffer = [];var lenglitchbuf = 2;

	wsAudioRX = new WebSocket( 'wss://' + window.location.href.split( '/' )[2] + '/audioRX' );
	wsAudioRX.binaryType = 'arraybuffer';
	wsAudioRX.onmessage = appendwsAudioRX;
	wsAudioRX.onopen = wsAudioRXopen;
	wsAudioRX.onclose = wsAudioRXclose;
	wsAudioRX.onerror = wsAudioRXerror;

	function appendwsAudioRX( msg ){
		var buffer = new Float32Array(msg.data);
		audiobuffer.push(buffer);
		if(audiobuffer.length>lenglitchbuf){audiobufferready= true;}
		//console.log(audiobuffer.length);
		
	}

	var BUFF_SIZE = 256; // spec allows, yet do not go below 1024 
	AudioRX_context = new AudioContext({latencyHint: "interactive",sampleRate: 8000});
	var AudioRX_gain_node = AudioRX_context.createGain();
	AudioRX_gain_node.connect( AudioRX_context.destination );
	AudioRX_source_node = AudioRX_context.createScriptProcessor(BUFF_SIZE, 1, 1);

	AudioRX_source_node.onaudioprocess = (function() {
		return function(event) {
			var synth_buff = event.outputBuffer.getChannelData(0); // mono for now
			if(audiobufferready){
				for (var i = 0, buff_size = synth_buff.length; i < buff_size; i++) {
					synth_buff[i] = audiobuffer[0][i];
				}
				if(audiobuffer.length > 1){audiobuffer.shift();}	
			}
			
		};
	}());

	AudioRX_source_node.connect(AudioRX_gain_node);
}

function wsAudioRXopen(){
	document.getElementById("indwsAudioRX").innerHTML='<img src="img/critsgreen.png">wsRX';
}

function wsAudioRXclose(){
	document.getElementById("indwsAudioRX").innerHTML='<img src="img/critsred.png">wsRX';
	AudioRX_stop();
}

function wsAudioRXerror(err){
	document.getElementById("indwsAudioRX").innerHTML='<img src="img/critsred.png">wsRX';
	AudioRX_stop();
}

function AudioRX_stop()
{
	audiobufferready = false;
	wsAudioRX.close();
	AudioRX_source_node.onaudioprocess = null
	AudioRX_context.close();
}

//ControlTRX routines///////////////////////////////////////////////////////////////////////////
var wsControlTRX = "";

function ControlTRX_start(){
	document.getElementById("indwsControlTRX").innerHTML='<img src="img/critsgrey.png">wsCtrl';
	wsControlTRX = new WebSocket( 'wss://' + window.location.href.split( '/' )[2] + '/CTRX' );
	wsControlTRX.onopen = wsControlTRXopen;
	wsControlTRX.onclose = wsControlTRXclose;
	wsControlTRX.onerror = wsControlTRXerror;
	wsControlTRX.onmessage = wsControlTRXcrtol;
}

function wsControlTRXcrtol( msg ){
	console.log(String(msg.data));
	words = String(msg.data).split(':');
	if(words[0] == "PONG"){showlatency();}
	else if(words[0] == "getFreq"){showfreq(words[1]);}
	
}

function ControlTRX_stop()
{
	wsControlTRX.close();
} 

function wsControlTRXopen(){
	document.getElementById("indwsControlTRX").innerHTML='<img src="img/critsgreen.png">wsCtrl';
	wsControlTRX.send("getFreq:");
}

function wsControlTRXclose(){
	document.getElementById("indwsControlTRX").innerHTML='<img src="img/critsred.png">wsCtrl';
}

function wsControlTRXerror(err){
    wsControlTRX.close();
	document.getElementById("indwsControlTRX").innerHTML='<img src="img/critsred.png">wsCtrl';
	ControlTRX_start();
}

var startTime;
function checklatency() {
	setTimeout(function () {
		startTime = Date.now();
		if (wsControlTRX.readyState === WebSocket.OPEN) {wsControlTRX.send("PING");}
		if(poweron == true){checklatency();}
	}, 5000);
}

function showlatency(){
	latency = Date.now() - startTime;
	document.getElementById("div-latencymeter").innerHTML="latency:"+latency+"ms";
}

function get_digit_freq(){
	return parseInt(
		document.getElementById("cmhz").innerHTML+
		document.getElementById("dmhz").innerHTML+
		document.getElementById("umhz").innerHTML+
		document.getElementById("ckhz").innerHTML+
		document.getElementById("dkhz").innerHTML+
		document.getElementById("ukhz").innerHTML+
		document.getElementById("chz").innerHTML+
		document.getElementById("dhz").innerHTML+
		document.getElementById("uhz").innerHTML
		);
}

freq_digit_selected="";
function freq_digit_scroll() {
	if (poweron) {
		if(event.deltaY>0){toadd=-1;}else{toadd=1;}
		freq=get_digit_freq()+(freq_digit_selected.getAttribute('v')*toadd);
		if(freq>0){showfreq(freq);sendTRXfreq();}
	}
}

function select_digit() {
	freq_digit_selected=event.srcElement;
}

function clear_select_digit() {
	freq_digit_selected="";
}

function rotatefreq(){
	if (poweron) {
		freq=get_digit_freq()+parseInt(event.srcElement.getAttribute('v'));
		if(freq>0){showfreq(freq);sendTRXfreq();}
	}
}

function showfreq(freq){
	freq=freq.toString();
	while (freq.length < 9){freq="0"+freq;}
	document.getElementById("cmhz").innerHTML=freq.substring(0, 1);
	document.getElementById("dmhz").innerHTML=freq.substring(1, 2);
	document.getElementById("umhz").innerHTML=freq.substring(2, 3);
	document.getElementById("ckhz").innerHTML=freq.substring(3, 4);
	document.getElementById("dkhz").innerHTML=freq.substring(4, 5);
	document.getElementById("ukhz").innerHTML=freq.substring(5, 6);
	document.getElementById("chz").innerHTML=freq.substring(6, 7);
	document.getElementById("dhz").innerHTML=freq.substring(7, 8);
	document.getElementById("uhz").innerHTML=freq.substring(8, 9);
}

function sendTRXfreq(){
	if (wsControlTRX.readyState === WebSocket.OPEN) {wsControlTRX.send("setFreq:"+get_digit_freq());}
}
	
//Cosmetics
function button_pressed(item)
{
	if(!item){item=event.srcElement;}
	item.classList.remove('button_unpressed');
	item.classList.add('button_pressed');
	button_light(item);
}

function button_unpressed(item)
{
	if(!item){item=event.srcElement;}
	item.classList.remove('button_green');
	item.classList.remove('button_pressed');
	item.classList.add('button_unpressed');
}

function button_light(item,color="G")
{
	if(!item){item=event.srcElement;}
	if(color=="G"){
		if(poweron){item.classList.add('button_green');}
		else{item.classList.remove('button_green');}
	}
	else if(color=="R"){
		if(poweron){item.classList.add('button_red');}
		else{item.classList.remove('button_red');}
	}
	else if(color=="Z"){
		item.classList.remove('button_red');
	}
}
	
	
	
	
	
	

