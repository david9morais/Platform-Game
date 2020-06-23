// Exercicio 5.2
// Camera.js
var Camera = Class.extend(function(){
  this.x=0;
  this.y=0;
  this.width= 0;
  this.height= 0;
  
 
  this.constructor= function(x,y,w,h){
	  if(x!=undefined && y!=undefined && w!= undefined && h!= undefined) this.setup(x,y,w,h);
  };
  
  this.setup=function(x,y,w,h){
	this.x=x;
	this.y=y;
	this.width= w;
	this.height= h; 
  }
 
  this.center=function(gameWorld){
	this.x = (gameWorld.x + gameWorld.width / 2) - this.width / 2;
	this.y = (gameWorld.y + gameWorld.height / 2) - this.height / 2;
  }
  
  
  this.rightInnerBoundary = function(){
    return this.x + (this.width * 0.75);
  } 
  
  
  this.leftInnerBoundary = function(){
    return this.x + (this.width * 0.25);
  } 
  
  
  this.topInnerBoundary = function(){
    return this.y + (this.height * 0.25);
  } 
  
  
  this.bottomInnerBoundary = function(){
    return this.y + (this.height * 0.75);
  }
    // função de debug. Desenha os limites interiores do rectangulo imaginário da câmara
  this.drawFrame=function(ctx, drawInnerBoundaries,colorF, colorIB){
	 colorF=colorF!=undefined?colorF:"red";
	 colorIB=colorIB!=undefined?colorIB:"blue";
	 if (ctx==undefined||drawInnerBoundaries==undefined) return;
	 ctx.strokeStyle=colorF;
	 ctx.strokeRect(this.x,this.y,this.width,this.height);
	 ctx.fillStyle=colorF;
	 ctx.font="12px Arial"; 
     ctx.fillText("Camera frame:"+this.width+"x"+this.height,this.x+5,this.y+15); 
	 ctx.fillText("Camera pos:"+this.x+":"+this.y,this.x+5,this.y+30); 
     if(this.vx!=undefined)	ctx.fillText("Camera vel:"+this.vx+":"+this.vy,this.x+5,this.y+45); 
	 if (this.leftInnerBoundary==undefined) return;  
	  if (drawInnerBoundaries){ 
	   
		ctx.strokeStyle=colorIB;
		ctx.moveTo(this.leftInnerBoundary(),this.topInnerBoundary()-10) 
		ctx.lineTo(this.leftInnerBoundary(),this.bottomInnerBoundary()+10);
		
		ctx.moveTo(this.rightInnerBoundary(),this.topInnerBoundary()-10) 
		ctx.lineTo(this.rightInnerBoundary(),this.bottomInnerBoundary()+10);
		
		ctx.moveTo(this.leftInnerBoundary()-10,this.topInnerBoundary()) 
		ctx.lineTo(this.rightInnerBoundary()+10,this.topInnerBoundary());

		ctx.moveTo(this.leftInnerBoundary()-10,this.bottomInnerBoundary()) 
		ctx.lineTo(this.rightInnerBoundary()+10,this.bottomInnerBoundary());
		ctx.stroke();
		
		ctx.fillStyle=colorIB;
		ctx.font="12px Arial"; 
        ctx.fillText(this.leftInnerBoundary(),this.leftInnerBoundary(),this.topInnerBoundary()-10);
	    ctx.fillText(this.rightInnerBoundary(),this.rightInnerBoundary(),this.topInnerBoundary()-10);
		
		ctx.fillText("Camera Inner Boundaries",this.leftInnerBoundary()+5,this.topInnerBoundary()+15);
	  }
  }
});


