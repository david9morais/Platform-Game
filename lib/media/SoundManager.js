// LOAD: 	http://www.html5rocks.com/en/tutorials/webaudio/intro/#toc-load
// EFEITOS: http://www.html5rocks.com/en/tutorials/webaudio/fieldrunners/
// consultar isto
// https://developer.apple.com/library/iad/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/PlayingandSynthesizingSounds/PlayingandSynthesizingSounds.html

SoundManager = Class.extend(function(){
	this.clips={};
	this.enabled= true;
	this._context= null;
	this._mainNode= null;
	 

	//----------------------------
	this.constructor=function() {
        this._context = new AudioContext();
		this._mainNode = this._context.createGain(0);
		this._mainNode.connect(this._context.destination);
	};

	//----------------------------
	// Parametros:
	//	1) path: url do ficheiro de audio.
	//  2) callbackFcn: função a ser chamada assim que o ficheiro de audio é carregado
	//----------------------------
	this.loadAsync =function (path, callbackFcn) {
		if (this.clips[path]) {
			callbackFcn(this.clips[path].s);
			return this.clips[path].s;
		}

		var clip = {
			s: new Sound(),
			b: null,
			l: false,
			node:undefined
		};
		this.clips[path] = clip;
		clip.s.path = path;

		var request = new XMLHttpRequest();
		request.open('GET', path, true);
		request.responseType = 'arraybuffer';
		request.onload = function () {   
		this._context.decodeAudioData(request.response,
			function (buffer) {  
				this.clips[path].b = buffer;
				this.clips[path].l = true;
				callbackFcn(this.clips[path].s);
			}.bind(this),

			function (data) {});
		}.bind(this);
		request.send();
		return clip.s;
	};

	//----------------------------
	this.toggleMute=function () {
		// Verifica se o valor do ganho do mainNode é 0
		// se sim, coloca a 1. caso contrário coloca a 0
 
		if(this._mainNode.gain.value>0) {
			this._mainNode.gain.value = 0;
		}
		else {
			this._mainNode.gain.value = 1;
		}
	};

	//----------------------------
	this.stopAll= function(){  
		// Disconecta o Main node, e cria um novo gainNode que é ligado ao context.destination
		this._mainNode.disconnect();
		this._mainNode = this._context.createGain(0);
		this._mainNode.connect(this._context.destination);
	};

	//----------------------------
	// Parametros:
	//	1) path: URL do ficheiro de audio
	//  2) settings: um objeto que encapsula as definições de som:
	//               {
	//                   looping: true ou false 
	//                   volume: um número entre 0 e 1.
	//               }
	//----------------------------
	this.playSound= function (path, settings) {
        // Verifica se o Sound Manager está enabled
		 
		if (!this.enabled) return false;

 
		// 
		var looping = false;
		var volume = 0.2;
        // verifica se os setting forma definidos
		if (settings) {
			if (settings.looping) looping = settings.looping;
			if (settings.volume) volume = settings.volume;
		}
        // verifica se uma path está associado a um clip.
		// e se um som ainda não foi carregado
		// Devolve false se ambos os testes falharem
 
		var sd = this.clips[path];
	 	if (sd === null) return false;
		 if (sd.l === false) return false;

		var currentClip = null;

		// cria um novo buffer source para o som que se quer reproduzir

		currentClip = this._context.createBufferSource();
       
		// Set the properties of currentClip appropriately in order to play the sound.
		// estabelece as propriedades do currentClip apropriadamente para reproduzir o som 
		currentClip.buffer = sd.b; //define a fonte a ser reproduzida
	    // cria-se o ganho para o clip
	    var csGain = this._context.createGain(0);
		csGain.gain.value=volume;
		 
	 
		currentClip.loop = looping;
         // connecta o currentClipao main node e executa a sua reprodução.
		 
		currentClip.connect(csGain);
		
		// ligar o ganho do clip ao ganho global
		csGain.connect(this._mainNode);
		currentClip.start(0);
		sd.node=currentClip;  // referencia para o buffer actual;
		return true;
	};
 

	this.stopSound= function (path) {
 		if (!this.enabled) return false;
	 	var sd = this.clips[path];
	 	if (sd === null) return false;
	    if (sd.l === false) return false;
		var currentClip = sd.node;
 		currentClip.stop();
		return true;
	};
	
	this.setVolume= function (path,volume) {
 		if (!this.enabled) return false;
	 	var sd = this.clips[path];
	 	if (sd === null) return false;
	    if (sd.l === false) return false;
		
		var currentClip = sd.node;
		
		var csGain = this._context.createGain(0);
		csGain.gain.value=volume;
		 
		csGain.connect(this._mainNode);
		currentClip.disconnect();
		currentClip.connect(csGain);
		 
		return true;
	};
});

//----------------------------
Sound = Class.extend(function(){
	this.play=function(loop,vol) {
		 
		// chama a função playSound com os parametros apropriados
		gSoundManager.playSound(this.path,{looping:loop, volume:vol});
	};
	
	this.stop=function() {
		// para a reprodução do som 
		 
		gSoundManager.stopSound(this.path);		
	};
	this.setVolume=function(volume) {
		// define um novo volume para o som (0..1)
		gSoundManager.setVolume(this.path,volume);		
	};
});

//----------------------------
function playSoundInstance(soundpath) {
	 
	// Carrega um novo Sound object, e faz a sua reprodução  
	var sound = gSoundManager.loadAsync(soundpath, function(sObj) {sObj.play(soundpath,false);});
}

// dicionario global de sons já carregados 
var gSoundManager = new SoundManager();

