 /*
   HTML Canvas filters and Efects library
   Author: Cláudio Barradas, ESGT-IPSantarem, 2017
   Development Status: Work in progress
 */
HTMLCanvasElement.prototype.grayScale=function(_putImageData){
 var ctx= this.getContext("2d");	
 ctx.save();
 var imageData=ctx.getImageData(0,0, this.width, this.height);
 
 var dataArray = imageData.data;

 for(var i = 0; i < dataArray.length; i += 4){
        var red = dataArray[i];
        var green = dataArray[i + 1];
        var blue = dataArray[i + 2];
        var alpha = dataArray[i + 3];
            
        var gray = (red + green + blue) / 3;
            
        dataArray[i] = gray;
        dataArray[i + 1] = gray;
        dataArray[i + 2] = gray;
        dataArray[i + 3] = alpha; // not changing the transparency
  }
  if(_putImageData===undefined|| _putImageData===null || _putImageData!==false) {
	ctx.putImageData(imageData,0,0); 
  }
  ctx.restore();
  return imageData;
};


HTMLCanvasElement.prototype.colorize=function(fillColor){
	var ctx= this.getContext("2d");	// obter o contexto
	 
	ctx.save();
	// converte os pixeis para escala de cinza
	var imageData=this.grayScale(false);
	
	//Canvas composition méthods: fonte https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
	
	// desenhar um rectangulo com a cor especificada no parâmetro . Com o método source-stop, a forma 
	// apenas é desenhada nas áreas onde se sobrepões com os elementos ja desenhados no canvas
	ctx.globalCompositeOperation = "source-atop";
	 
	ctx.fillStyle = fillColor;
    ctx.fillRect(0,0,this.width,this.height);
	
	var mask= ctx.getImageData(0,0, this.width, this.height);
	  
    // repoisição do método por defeito (source-over)
	ctx.globalCompositeOperation = "source-over";
	ctx.putImageData(imageData,0,0);
	// canvas auxiliar para de guardar a máscara de colorize e posteriormente utilizar no drawImage
	var aux = document.createElement("canvas");
	aux.height=this.height;
	aux.width=this.width;
	aux.getContext("2d").putImageData(mask,0,0);
	
	// sobrepor a máscara com o método overlay
	ctx.globalCompositeOperation = "overlay";
	ctx.globalAlpha = 0.9;	
	ctx.drawImage(aux,0,0);
	ctx.restore();
};

HTMLCanvasElement.prototype.fadeOut=function(time){
	var ctx= this.getContext("2d");	// obter o contexto
	var imageData= ctx.getImageData(0,0, this.width, this.height);
 	ctx.save();
 
	var wait=10;
	var decrement= 1/ (time/10);
    var aux = document.createElement("canvas");
	aux.height=this.height;
	aux.width=this.width;
	aux.getContext("2d").putImageData(imageData,0,0);
	
    ctx.globalCompositeOperation = "source-over";
 	startFading();
	function startFading(){
		  
		if(ctx.globalAlpha -decrement>=0) {
			ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
			ctx.globalAlpha-=decrement;
		    ctx.drawImage(aux,0,0);	
			setTimeout(startFading,10);
		}

	}
	ctx.restore();
};

HTMLCanvasElement.prototype.fadeIn=function(time){
	var ctx= this.getContext("2d");	// obter o contexto
	var imageData= ctx.getImageData(0,0, this.width, this.height);
	ctx.globalAlpha=0;
 	ctx.save();
 
	var wait=10;
	var increment= 1/ (time/10);
    var aux = document.createElement("canvas");
	aux.height=this.height;
	aux.width=this.width;
	aux.getContext("2d").putImageData(imageData,0,0);
	
    ctx.globalCompositeOperation = "source-over";
 	startFading();
	function startFading(){
		  
		if(ctx.globalAlpha + increment<=1) {
			ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
			ctx.globalAlpha+=increment;
		    ctx.drawImage(aux,0,0);	
			setTimeout(startFading,10);
		}

	}
	ctx.restore();
};
