var Hero = Entity.extend(function () {
		this.currState = undefined; // estado atual;

		var maisLento = 0;
		var podeDisparar = false;

		this.states = {
			RunRight: 'RunRight',
			RunLeft: 'RunLeft',

			IdleRight: 'IdleRight',
			IdleLeft: 'IdleLeft',

			DeadRight: 'DeadRight',
			DeadLeft: 'DeadLeft',

			JumpRight: 'JumpRight',
			JumpLeft: 'JumpLeft',

			SlideRight: 'SlideRight',
			SlideLeft: 'SlideLeft',

			ShootRight: 'ShootRight',
			ShootLeft: 'ShootLeft',

			MeleeRight: 'MeleeRight',
			MeleeLeft: 'MeleeLeft',

			MeleeAirLeft: 'MeleeAirLeft',
			MeleeAirRight: 'MeleeAirRight',

			ShootAirLeft: 'ShootAirLeft',
			ShootAirRight: 'ShootAirRight',

			ShootMovingRight: 'ShootMovingRight',
			ShootMovingLeft: 'ShootMovingLeft'
		};

		this.sounds = {};

		this.constructor = function (spriteSheet, x, y, sounds) {
			this.super();
			this.x=x;
			this.y=y;
			this.spriteSheet=spriteSheet;
			this.currState=this.states.IdleRight;
			this.currentFrame=0;
			this.sounds = sounds;
			setup();
		};

		var setup = function () {
			this.eStates.RunRight = this.spriteSheet.getStats('RunRight');
			this.eStates.RunLeft = this.spriteSheet.getStats('RunLeft');

			this.eStates.ShootRight = this.spriteSheet.getStats('ShootRight');
			this.eStates.ShootLeft = this.spriteSheet.getStats('ShootLeft');

			this.eStates.IdleRight = this.spriteSheet.getStats('IdleRight');
			this.eStates.IdleLeft = this.spriteSheet.getStats('IdleLeft');

			this.eStates.DeadRight = this.spriteSheet.getStats('DeadRight');
			this.eStates.DeadLeft = this.spriteSheet.getStats('DeadLeft');

			this.eStates.JumpRight = this.spriteSheet.getStats('JumpRight');
			this.eStates.JumpLeft = this.spriteSheet.getStats('JumpLeft');

			this.eStates.SlideRight = this.spriteSheet.getStats('SlideRight');
			this.eStates.SlideLeft = this.spriteSheet.getStats('SlideLeft');

			this.eStates.ShootRight = this.spriteSheet.getStats('ShootRight');
			this.eStates.ShootLeft = this.spriteSheet.getStats('ShootLeft');

			this.eStates.MeleeRight = this.spriteSheet.getStats('MeleeRight');
			this.eStates.MeleeLeft = this.spriteSheet.getStats('MeleeLeft');

			this.eStates.MeleeAirLeft = this.spriteSheet.getStats('MeleeAirLeft');
			this.eStates.MeleeAirRight = this.spriteSheet.getStats('MeleeAirRight');

			this.eStates.ShootAirLeft = this.spriteSheet.getStats('ShootAirLeft');
			this.eStates.ShootAirRight = this.spriteSheet.getStats('ShootAirRight');

			this.eStates.ShootMovingLeft = this.spriteSheet.getStats('ShootMovingLeft');
			this.eStates.ShootMovingRight = this.spriteSheet.getStats('ShootMovingRight');

			this.frames = this.eStates[this.currState];
			this.width = this.frames[0].width; //atualizar a altura
			this.height = this.frames[0].height; // atualizar os
			//console.log(this.eStates);
		}.bind(this);

		this.update = function () {
			if (!this.active)
			return;
		
		
			if (maisLento++ % 5 !== 0) return;
				maisLento = 1;
			
			if (this.currState == this.states.DeadRight && this.currentFrame == this.frames.length - 1)
				return;

			if (this.currState == this.states.DeadLeft && this.currentFrame == this.frames.length - 1)
				return;

			this.currentFrame = (++this.currentFrame)%this.frames.length;
			
			this.width = this.frames[this.currentFrame].width*0.2; //atualizar a altura
			this.height = this.frames[this.currentFrame].height*0.2; // atualizar os
			this.updateSize();
			
			if (this.currState === this.states.ShootRight && this.currentFrame == this.frames.length - 1) {
				this.dispararDir();
			}
			if (this.currState === this.states.ShootLeft && this.currentFrame == this.frames.length - 1) {
				this.dispararEsq();
			}
			if (this.currState == this.states.DeadRight) {
				this.morrerDir();
				this.active = true;
			}
			if(this.currState == this.states.DeadLeft){
				this.morrerEsq();
				this.active = true;
			}
		};
		
		//ANDAR
		this.andarDir = function () {
			toogleState(this.states.RunRight);
		};
		this.andarEsq = function () {
			toogleState(this.states.RunLeft);
		};

		//IDLE
		this.pararDir = function () {
			toogleState(this.states.IdleRight);
		};
		this.pararEsq = function () {
			toogleState(this.states.IdleLeft);
		};

		//SLIDE
		this.deslizarDir = function () {
			toogleState(this.states.SlideRight);
		};
		this.deslizarEsq = function () {
			toogleState(this.states.SlideLeft);
		};

		//SHOOT
		this.dispararDir = function () {
			toogleState(this.states.ShootRight);
			this.sounds.ShootRight.play(false,0.2);
		};
		this.dispararEsq = function () {
			toogleState(this.states.ShootLeft);
			this.sounds.ShootLeft.play(false,0.2);
		};

		//DEAD
		this.morrerDir = function () {
			toogleState(this.states.DeadRight);
			this.sounds.DeadRight.play(false,0.1);
			this.y += 10;
		};
		this.morrerEsq = function () {
			toogleState(this.states.DeadLeft);
			this.sounds.DeadLeft.play(false,0.1);
			this.y += 10;
		};
		
		//JUMP
		this.saltarDir = function() {
			toogleState(this.states.JumpRight);
		};
		this.saltarEsq = function() {
			toogleState(this.states.JumpLeft);
		};

		//JUMP SHOOT
		this.disparaSaltoDir = function() {
			toogleState(this.states.ShootAirRight);
			this.sounds.ShootAirRight.play(false,0.2);
		};
		this.disparaSaltoEsq = function() {
			toogleState(this.states.ShootAirLeft);
			this.sounds.ShootAirLeft.play(false,0.2);
		};

		//JUMP MELEE
		this.atacaSaltoDir = function() {
			toogleState(this.states.MeleeAirRight);
			this.sounds.MeleeAirRight.play(false,0.2);
		};
		this.atacaSaltoEsq = function() {
			toogleState(this.states.MeleeAirLeft);
			this.sounds.MeleeAirLeft.play(false,0.2);
		};

		//RUN SHOOT
		this.dispararCorreDir = function() {
			toogleState(this.states.ShootMovingRight);
			this.sounds.ShootMovingRight.play(false,0.2);
		};
		this.dispararCorreEsq = function() {
			toogleState(this.states.ShootMovingLeft);
			this.sounds.ShootMovingLeft.play(false,0.2);
		};

		//MELEE
		this.atacaDir = function() {
			toogleState(this.states.MeleeRight);
			this.sounds.MeleeRight.play(false,0.2);
		};
		this.atacaEsq = function() {
			toogleState(this.states.MeleeLeft);
			this.sounds.MeleeLeft.play(false,0.2);
		};

		var toogleState = function (newState) {
			if (this.killed)return;
			if(this.currState===newState) return; // se o novo estado � igual ao atual, n�o se faz nada
			// sen�o .....
			this.currentFrame=0;                     // dfine-se a frame atual para  0
			this.currState=newState;	             // troca-se o estado 
			this.frames=this.eStates[this.currState]; // aponta-se o array das frames para o array correspondente ao novo estado no dicionario de estados
		}.bind(this);

	});