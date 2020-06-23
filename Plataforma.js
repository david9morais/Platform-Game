var Plataforma = Entity.extend(function () {

	// neste exemplo as plataformas não têmc componente visual, pois vem da tilesheet
	this.constructor = function (x, y, w, h) {
		this.super();
		this.x = x; //posX inicial
		this.y = y; // posY inicial
		this.width = w; //largura inicial
		this.height = h; // altura inicial
	};

	this.update = function () {
	};

	// como não tem componente visual, sobreescrevemos o método render para evitar possíveis chamadas indevidas
	this.render = function () {
		
	};


});
