var Entity = Class.extend(function () {
		this.spriteSheet = undefined; // Spritesheet associada � entidade
		this.eStates = {}; // dicionario de estados. Objecto de arrays de estados
		this.frames = new Array(); // array com as frames atuais
		this.currentFrame = 0; // frame atual
		this.x = 0;				
		this.y = 0;
		this.width = 0;
		this.height = 0;
		this.alpha = 1;
		this.shadow = {
			active: false,
			shadowColor: "rgba(100, 100, 100, 0.5)",
			shadowOffsetX: 3,
			shadowOffsetY: 3,
			shadowBlur: 3
		};
		this.rotation = 0;
		this.visible = true;
		this.active = true; // propriedade que indica que a entidade est� activa. Se active=false, n�o deve ser apresentada
		this.killed = false;

		this.vx = 0;
		this.vy = 0;
		this.scaleFactor = 1; //local
		this.isColliding = false;
		this.flipH=1;
		this.flipV=1;

		//Physic Properties
		this.accelerationX = 0;
		this.accelerationY = 0;
		this.speedLimit = 5;
		this.friction = 0.96;
		this.bounce = -0.7;
		this.gravity = 0.3;

		//Platform Game Properties
		this.isOnGround = undefined;
		this.jumpForce = -13;
 
		// ----------------------------------------------------------

		this.constructor = function () {};

		this.update = function () {};

		this.left = function () {
			return this.x;
		}
		this.right = function () {
			return this.x + this.width;
		}
		this.top = function () {
			return this.y;
		}
		this.bottom = function () {
			return this.y + this.height;
		}

		this.scale = function (sf) {
			this.scaleFactor = sf;
			this.updateSize();
		}

		this.updateSize = function () {
			var ar = this.width / this.height;
			this.width = this.width * this.scaleFactor;
			this.height = this.width / ar;
		}

		this.getCenterX = function () {
			return this.x + (this.width * 0.5);
		} // this.width >> 1; � mais eficiente

		this.getCenterY = function () {
			return this.y + (this.height * 0.5);
		}

		this.getHalfWidth = function () {
			return this.width * 0.5;
		}

		this.getHalfHeight = function () {
			return this.height * 0.5;
		}

		this.getSprite = function () {
			return this.frames[this.currentFrame];
		};

		this.flipHorizontal=function(){ // a fun��o inverte o flip em vigor
			this.flipH*=-1;
		}
		
		this.flipVertical=function(){
			this.flipV*=-1;
		}
		
		this.render = function (ctx) {
			if (!this.active || ctx === null || ctx === undefined || !this.visible)
				return;

			ctx.save();
			var sprite = this.getSprite();

			if (this.shadow.active) {
				ctx.shadowColor = this.shadow.shadowColor;
				ctx.shadowOffsetX = this.shadow.shadowOffsetX
				ctx.shadowOffsetY = this.shadow.shadowOffsetY
				ctx.shadowBlur = this.shadow.shadowBlur;
			}

			ctx.globalAlpha = this.alpha;
			
			ctx.scale(this.flipH,this.flipV); // faz o mirror
			
			if (this.rotation != 0) { // render com rota��o
			 
				// transla��o para o eixo da entidade
				ctx.translate(this.x + (this.width >> 1), this.y + (this.height >> 1));
				ctx.rotate(this.rotation * Math.PI / 180);

				ctx.drawImage(
					this.spriteSheet.img,
					sprite.x, sprite.y,
					sprite.width, sprite.height,
					Math.floor(-this.width >> 1)*this.flipH, Math.floor(-this.height >> 1)*this.flipV,
					Math.floor(this.width)*this.flipH, Math.floor(this.height)*this.flipV);
			} else { //render sem rota��o
					ctx.drawImage(
					this.spriteSheet.img,
					sprite.x, sprite.y,
					sprite.width, sprite.height,
					Math.floor(this.x)*this.flipH, Math.floor(this.y)*this.flipV,
					Math.floor(this.width)*this.flipH,Math.floor(this.height)*this.flipV);
					
					// utiliza-se o Math.floor() para evitar o subpixel rendering pelo canvas, que suaviza a imagem
			}
			ctx.restore();
			//this.drawColisionBoundaries(ctx,true,false,'red','red');
		}

		this.drawColisionBoundaries = function (ctx, boundingRect, boundingCircle, colorR, colorC) {
			if (ctx == undefined)
				return;
			//if(boundingRect==undefined || boundingCircle==undefined)return;

			if (boundingRect) {
				ctx.beginPath();
				ctx.rect(this.x, this.y, this.width, this.height);
				ctx.lineWidth = 1;
				ctx.strokeStyle = colorR != undefined ? colorR : "yellow";
				ctx.stroke();
			}
			if (boundingCircle) {
				ctx.beginPath();
				ctx.arc(this.getCenterX(), this.getCenterY(), (this.getHalfWidth() + this.getHalfHeight()) / 2, 0, 2 * Math.PI, false);
				ctx.lineWidth = 1;
				ctx.strokeStyle = colorC != undefined ? colorC : "blue";
				ctx.stroke();
			}
		}

		//hitTestPoint
		this.hitTestPoint = function (pointX, pointY) {
			return (pointX > this.left() && pointX < this.right() &&
				pointY > this.top() && pointY < this.bottom());
		}

		//hitTestCircle

		this.hitTestCircle = function (otherEntity) {

			// Calcula o vetor entre os centros das circunferencias
			var vx = this.getCenterX() - otherEntity.getCenterX();
			var vy = this.getCenterY() - otherEntity.getCenterY();

			// Calcular a distancia entre as circunferencias, calculando a magnitude do vetor
			// (comprimento do vetor)
			var magnitude = Math.sqrt(vx * vx + vy * vy);

			// soma das metades das larguras das entidades
			var totalRadii = this.getHalfWidth() + otherEntity.getHalfWidth();

			// existe colis�o se a distancia entre os circulos � menor que o totalRadii
			var hit = magnitude < totalRadii;

			return hit;
		}

		//blockCircle

		this.blockCircle = function (otherEntity) {
			// Calcula o vetor entre os centros das circunferencias
			var vx = this.getCenterX() - otherEntity.getCenterX();
			var vy = this.getCenterY() - otherEntity.getCenterY();

			// Calcular a distancia entre as circunferencias, calculando a magnitude do vetor
			// (comprimento do vetor)	  )
			var magnitude = Math.sqrt(vx * vx + vy * vy);

			// soma das metades das larguras das entidades
			var combinedHalfWidths = this.getHalfWidth() + otherEntity.getHalfWidth();

			//Verificar se existe colis�o
			if (magnitude < combinedHalfWidths) {
				//sim, existe colis�o
				//calcular o total de sobreposi��o
				var overlap = combinedHalfWidths - magnitude;

				//Normaliza��o do vector.
				//Estes valores indicam a dire��o da colis�o
				dx = vx / magnitude;
				dy = vy / magnitude;

				// Mover a circunferencia 1 para fora da colis�o, multiplicando a sobreposi��o
				// com o vetor normalizado e adicionar � posi��o da primeira circunferencia
				this.x += overlap * dx;
				this.y += overlap * dy;
			}
		}

		//hitTestRectangle

		this.hitTestRectangle = function (otherEntity) {

			var hit = false;

			//Calculo do vetor de distancia
			var vx = this.getCenterX() - otherEntity.getCenterX();
			var vy = this.getCenterY() - otherEntity.getCenterY();

			//soma das metades das largura e alturas
			var combinedHalfWidths = this.getHalfWidth() + otherEntity.getHalfWidth();
			var combinedHalfHeights = this.getHalfHeight() + otherEntity.getHalfHeight();

			// verificar se ha colis�o no eixo X
			if (Math.abs(vx) < combinedHalfWidths) {
				//Uma colis�o poder� estar a ocorrer. Verificar se ocorre no eixo Y
				if (Math.abs(vy) < combinedHalfHeights) {
					hit = true;
				} //Existe mesmo uma colis�o
				else {
					hit = false;
				} //N�o h� colis�o no eixo Y
			} else {
				hit = false;
			} //N�o h� colis�o no eixo X

			return hit;
		} //blockRectangle


		this.blockRectangle = function (otherEntity) {
			//A variable to tell us which side the collision is occurring on
			var collisionSide = "";

			//Calculate the distance vector
			var vx = this.getCenterX() - otherEntity.getCenterX();
			var vy = this.getCenterY() - otherEntity.getCenterY();

			//Figure out the combined half-widths and half-heights
			var combinedHalfWidths = this.getHalfWidth() + otherEntity.getHalfWidth();
			var combinedHalfHeights = this.getHalfHeight() + otherEntity.getHalfHeight();

			//Check whether vx is less than the combined half widths
			if (Math.abs(vx) < combinedHalfWidths) {
				//A collision might be occurring!
				//Check whether vy is less than the combined half heights
				if (Math.abs(vy) < combinedHalfHeights) {
					//A collision has occurred! This is good!
					//Find out the size of the overlap on both the X and Y axes
					var overlapX = combinedHalfWidths - Math.abs(vx);
					var overlapY = combinedHalfHeights - Math.abs(vy);

					//The collision has occurred on the axis with the
					//*smallest* amount of overlap. Let's figure out which
					//axis that is

					if (overlapX >= overlapY) {
						//The collision is happening on the X axis
						//But on which side? vy can tell us
						if (vy > 0) {
							collisionSide = "TOP";
							//Move the rectangle out of the collision
							this.y = this.y + overlapY;
						} else {
							collisionSide = "BOTTOM";

							//Move the rectangle out of the collision
							this.y = this.y - overlapY;
						}
					} else {
						//The collision is happening on the Y axis
						//But on which side? vx can tell us
						if (vx > 0) {
							collisionSide = "LEFT";

							// Mover a entidade para fora da colis�o
							this.x = this.x + overlapX;
						} else {
							collisionSide = "RIGHT";

							// Mover a entidade para fora da colis�o
							this.x = this.x - overlapX;
						}
					}
				} else {
					//N�o h� colis�o
					collisionSide = -1;
				}
			} else {
				//N�o h� colis�o
				collisionSide = -1;
			}
			return collisionSide;
		}
});