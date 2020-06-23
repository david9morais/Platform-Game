var Component = Class.extend(function () {
		this.ctx = undefined; //canvas context
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

		this.constructor = function () {};

		this.update = function () {};

		this.left = function () {
			return this.x;
		};
		
		this.right = function () {
			return this.x + this.width;
		};
		
		this.top = function () {
			return this.y;
		};
		this.bottom = function () {
			return this.y + this.height;
		};

		this.getCenterX = function () {
			return this.x + (this.width * 0.5);
		}; // this.width >> 1; é mais eficiente
		
		this.getCenterY = function () {
			return this.y + (this.height * 0.5);
		};
		
		this.getHalfWidth = function () {
			return this.width * 0.5;
		};
		
		this.getHalfHeight = function () {
			return this.height * 0.5;
		};

});
