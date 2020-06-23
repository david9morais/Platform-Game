var BalaDrt = Entity.extend(function () {
	this.exploding = false;
	this.damageLevel = 0;

	this.states = {
		ATIVO: 'ATIVO',
		EXPLODIR: 'FOGO'
	};

	this.constructor = function (spriteSheet, x, y, damageLevel) {
		this.super();
		this.spriteSheet = spriteSheet; // spriteSheet
		this.x = x; //posX inicial
		this.y = y; // posY inicial
		this.currentState = this.states.ATIVO; //estado inicial
		this.currentFrame = 0; //frame inicial
		this.rotation = 0;
		this.vx = 10;
		this.vy = 0;
		this.damageLevel = damageLevel;
		setup();

	};

	this.update = function () {
		if (!this.active)
			return;

		this.x += this.vx;
		this.vx -= this.vx > 0 ? 0.005 : 0;

		this.y -= this.vy;

		// passar � proxima frame e voltar a zero se chegar ao fim do array; M�todo mais eficiente pois utiliza s� opera��es
		// aritm�ticas e n�o recorre a condi��es
		this.currentFrame = (++this.currentFrame) % this.frames.length;

		this.width = Math.floor(this.frames[this.currentFrame].width * 0.1);
		this.height = Math.floor(this.frames[this.currentFrame].height * 0.1);

		if (this.currState == this.states.EXPLODIR && this.currentFrame == this.frames.length - 1)
			this.active = false;

	};

	this.getSprite = function () {
		return this.frames[this.currentFrame];

	};

	var setup = function () {
		this.eStates[this.states.ATIVO] = this.spriteSheet.getStats('BulletRight');
		this.eStates[this.states.EXPLODIR] = this.spriteSheet.getStats('Muzzle');

		this.frames = this.eStates[this.currentState];
		this.width = this.frames[0].width;
		this.height = this.frames[0].height;
	}
	.bind(this);

	this.explodir = function () {
		if (!this.active)
			return;
		toogleState(this.states.EXPLODIR);
		this.vx = 0;
		this.vy = 0;
		this.exploding = true;
	};

	var toogleState = function (theState) {
		if (this.currState != theState) {
			this.currState = theState;
			this.frames = this.eStates[theState];
			this.currentFrame = 0;
		}
	}
	.bind(this);

});
