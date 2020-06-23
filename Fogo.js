var Fogo = Entity.extend(function () {
	this.currState = undefined; // estado atual;
	this.states = {
	  ATIVO: 'ATIVO'
	};
	this.currentFrame = 0;
  
	this.constructor = function (spriteSheet, x, y) {
	  this.super();
	  this.x = x;
	  this.y = y;
	  this.spriteSheet = spriteSheet;
	  this.currState = this.states.ATIVO;
	  this.currentFrame = 0;
	  setup();
	};
  
	this.update = function () {
		if (!this.active) return;
	
		// passar � proxima frame e voltar a zero se chegar ao fim do array; M�todo mais eficiente pois utiliza s� opera��es
		// aritm�ticas e n�o recorre a condi��es
		this.currentFrame = (++this.currentFrame) % this.frames.length;
	
		this.width = this.frames[this.currentFrame].width; //atualizar a largura
		this.height = this.frames[this.currentFrame].height * 0.1; // atualizar a altura
	
		if (this.currentFrame == this.frames.length - 1)
			this.active = false;
  
	};
  
	this.getSprite = function () {
	  return this.frames[this.currentFrame];
	};
  
	var setup = function () {
	  this.eStates.ATIVO = this.spriteSheet.getStats('Muzzle');
	  this.frames = this.eStates[this.currState];
	  this.width = this.frames[0].width; //atualizar a altura
	  this.height = this.frames[0].height; // atualizar os
	}.bind(this);
  
  });
  