var GameTimer = Component.extend(function () {
		var fillWith = 100;
		this.text = "";
		var borderColor = "white";
		var fillColor = "red";
		var textColor = "black";
		var started = undefined;
		var ended = undefined;
		var timer = undefined;
		var time;
		var prevTime = -1;
		// completar

		this.constructor = function (x, y, w, h, drawContext, _text, _textColor, _borderColor, _fillColor, sCallback, eCallback) {
			this.super();
			this.x = x;
			this.y = y;
			this.width = w;
			this.height = h;
			this.ctx = drawContext;
			borderColor = _borderColor !== undefined ? _borderColor : "white";
			fillColor = _fillColor !== undefined ? _fillColor : "red";
			textColor = _textColor !== undefined ? _textColor : "black";
			started = sCallback;
			ended = eCallback;
			time = 120;
			this.text = time.toString();
		};

		this.start = function () {
			timer = setInterval(update, 1000);
			started();
		};

		var finished = function() {
			if (ended !== null || ended !== undefined)	ended();
			clearInterval(timer);
		}.bind(this);

		this.stop = function () {
			clearInterval(timer);
		};

		var update= function () {

			time--;
			this.text = time < 10 ? "0" + time.toString() : time.toString();
			if (time < 0)
				finished();

		}.bind(this);

		this.render = function () {
			// completar
			if (prevTime == time)return;
			prevTime = time;

			this.ctx.clearRect(this.x - 40, this.y - 40,
				this.width + 80, this.height + 80);
				
			this.ctx.save();
			//desenho do fundo

			this.ctx.shadowColor = this.shadow.shadowColor;
			this.ctx.shadowBlur = this.shadow.shadowBlur;
			this.ctx.shadowOffsetX = this.shadow.shadowOffsetX;
			this.ctx.shadowOffsetY = this.shadow.shadowOffsetY;

			drawRoundRectangle(this.x, this.y, this.width, this.height, 5, "white", 10, getGradient());
			this.ctx.restore();

			this.ctx.rect(this.x, this.y, this.width, this.height);
			this.ctx.fillStyle = 'white';
			this.ctx.fill();
			this.ctx.closePath();
			this.ctx.restore();
			//desenho do preenchimento
			this.ctx.beginPath();
			this.ctx.rect(this.x, this.y, this.fillWith, this.height);
			console.log(this.textColor);
			this.ctx.fillStyle = textColor;
			this.ctx.font = "35px Arial black";
			this.ctx.fillText(this.text, this.left() + 2, this.height - (this.height / 6));

		};

		var getGradient=function() {
			var grd = this.ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
			grd.addColorStop(0, borderColor);
			grd.addColorStop(0.2, borderColor);
			grd.addColorStop(0.5, "white");
			grd.addColorStop(0.8, borderColor);
			grd.addColorStop(1, borderColor);
			return grd;
		}.bind(this);

		var drawRoundRectangle= function (xx, yy, ww, hh, rad, fill, strokeWidth, stColor) {
			if (typeof(rad) == "undefined")
				rad = 5;
			this.ctx.beginPath();
			this.ctx.moveTo(xx + rad, yy);
			this.ctx.arcTo(xx + ww, yy, xx + ww, yy + hh, rad);
			this.ctx.arcTo(xx + ww, yy + hh, xx, yy + hh, rad);
			this.ctx.arcTo(xx, yy + hh, xx, yy, rad);
			this.ctx.arcTo(xx, yy, xx + ww, yy, rad);
			this.ctx.lineWidth = strokeWidth;
			this.ctx.fillStyle = fill;
			this.ctx.strokeStyle = stColor;
			if (strokeWidth)
				this.ctx.stroke(); // Default to no stroke
			if (fill || typeof(fill) == "undefined")
				this.ctx.fill(); // Default to fill

		}.bind(this);// end of fillRoundedRect method

	});
