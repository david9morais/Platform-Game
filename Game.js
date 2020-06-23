var canvas;
var camera = undefined;
var gameWorld = undefined;

var canvases = {
	background: {
		canvas: null,
		ctx: null
	}, // canvas, drawingSurface (contex2d)
	entities: {
		canvas: null,
		ctx: null
	},
	components: {
		canvas: null,
		ctx: null
	}
};

var asBalas = [];
var osFogos = [];
var tx = 0;
var ty = 0;
var keys = new Array(255);
var assetsLoaded = 0;
var assets = [];
var animationHandler;
var level;
var gameTimer = undefined;
var lostGame = false;

//Primeiro Nivel
var entities1 = [];
var platforms = [];
var deadPlat = [];
var zombieGirl = [];
var zombieBoy = [];
var zombieGirl1 = [];
var zombieBoy1 = [];
var zBoyPlatform = [];
var zGirlPlatform = []
var zBoyPlatform1 = [];
var zGirlPlatform1 = [];

//Segundo Nivel
var entities2 = [];
var platforms1 = [];
var deadPlat1 = [];
var cowGirl1 = [];
var cowGirl2 = [];
var cowGirl3 = [];
var cowGirl4 = [];
var cPlatform = [];
var cPlatform1 = [];
var cPlatform2 = [];
var cPlatform3 = [];

//Terceiro Nivel
var entities3 = [];
var platforms2 = [];
var deadPlat2 = [];
var ninjaGirl = [];
var ninjaBoy = [];
var ninjaGirl1 = [];
var ninjaBoy1 = [];
var ninjaGirl2 = [];
var ninjaBoy2 = [];
var nBoyPlatform = [];
var nGirlPlatform = []
var nBoyPlatform1 = [];
var nGirlPlatform1 = [];
var nBoyPlatform2 = [];
var nGirlPlatform2 = [];

//estados do jogo
var GameStates = {
	RUNNING: 1,
	PAUSED: 2,
	STOPED: 3,
	LOADING: 4,
	LOADED: 5
}

//sons
var GameSounds = {
	ZOMBIE: {},
	AMBIENTE: {},
	NINJABOY: {},
	NINJAGIRL: {},
	COWGIRL:  {},
	WIN: {},
	LOSE: {},
	HERO: {}
};

var gameState = undefined;

window.addEventListener("load", init, false);

function init() {
	canvases.background.canvas = document.querySelector("#canvasBack");
	canvases.background.ctx = canvases.background.canvas.getContext("2d");

	canvases.entities.canvas = document.querySelector("#canvasEnt");
	canvases.entities.ctx = canvases.entities.canvas.getContext("2d");

	canvases.components.canvas = document.querySelector("#canvasComp");
	canvases.components.ctx = canvases.components.canvas.getContext("2d");

	load();
}

function load() {
	gameState = GameStates.LOADING;

	//criam-se os Tiled Map e carregam-se
	tileBackground = new TiledMap();
	tileBackground.load('./data', 'GraveyardMap.json', loaded);
	assets.push(tileBackground);

	tileBackground2 = new TiledMap();
	tileBackground2.load('./data', 'DesertMap.json', loaded);
	assets.push(tileBackground2);

	tileBackground3 = new TiledMap();
	tileBackground3.load('./data', 'ForestMap.json', loaded);
	assets.push(tileBackground3);

	//criam-se as Personagens e carregam-se
	spHero = new SpriteSheet();
	spHero.load("assets//Hero.png", "assets//Hero.json", loaded);
	assets.push(spHero);

	spBullet = new SpriteSheet();
	spBullet.load("assets//Bala.png", "assets//Bala.json", loaded);
	assets.push(spBullet);

	spZombieBoy = new SpriteSheet();
	spZombieBoy.load("assets//ZombieBoy.png", "assets//ZombieBoy.json", loaded);
	assets.push(spZombieBoy);

	spZombieGirl = new SpriteSheet();
	spZombieGirl.load("assets//ZombieGirl.png", "assets//ZombieGirl.json", loaded);
	assets.push(spZombieGirl);

	spCowGirl = new SpriteSheet();
	spCowGirl.load("assets//CowGirl.png", "assets//CowGirl.json", loaded);
	assets.push(spCowGirl);

	spNinjaBoy = new SpriteSheet();
	spNinjaBoy.load("assets//NinjaBoy.png", "assets//NinjaBoy.json", loaded);
	assets.push(spNinjaBoy);

	spNinjaGirl = new SpriteSheet();
	spNinjaGirl.load("assets//NinjaGirl.png", "assets//NinjaGirl.json", loaded);
	assets.push(spNinjaGirl);

	/* -------------------------------------- CARREGA SONS --------------------------------------- */

	/* ------------------------------------------------------------------------------------------- */

	/* -------------------------------------- ZOMBIE SOUNDS --------------------------------------- */

	//ZOMBIE ATTACK
	gSoundManager.loadAsync("sounds/zombie-attack.wav", function (so) {
		GameSounds.ZOMBIE.AttackLeft = so;
		loaded("zombie-attack.wav");
	});
	assets.push(GameSounds.ZOMBIE.AttackLeft);

	gSoundManager.loadAsync("sounds/zombie-attack.wav", function (so) {
		GameSounds.ZOMBIE.AttackRight = so;
		loaded("zombie-attack.wav");
	});
	assets.push(GameSounds.ZOMBIE.AttackRight);


	//ZOMBIE AMBIENTE
	gSoundManager.loadAsync("sounds/monastery-broken-chimes.wav", function (so) {
		GameSounds.AMBIENTE.ZOMBIES = so;
		loaded("monastery-broken-chimes.wav");
	});
	assets.push(GameSounds.AMBIENTE.ZOMBIES);


	//ZOMBIE DEATH
	gSoundManager.loadAsync("sounds/slow-zombie-death.mp3", function (so) {
		GameSounds.ZOMBIE.DeadRight = so;
		loaded("slow-zombie-death.wav");
	});
	assets.push(GameSounds.ZOMBIE.DeadRight);

	gSoundManager.loadAsync("sounds/slow-zombie-death.mp3", function (so) {
		GameSounds.ZOMBIE.DeadLeft = so;
		loaded("slow-zombie-death.wav");
	});
	assets.push(GameSounds.ZOMBIE.DeadLeft);


	//ZOMBIE WIN
	gSoundManager.loadAsync("sounds/scary-background-4.wav", function (so) {
		GameSounds.ZOMBIE.WIN = so;
		loaded("scary-background-4.wav");
	});
	assets.push(GameSounds.ZOMBIE.WIN);


	/* -------------------------------------- COWGIRL SOUNDS --------------------------------------- */

	//COWGIRL AMBIENTE
	gSoundManager.loadAsync("sounds/western-deep-progression-01.wav", function (so) {
		GameSounds.AMBIENTE.COWBOYS = so;
		loaded("western-deep-progression-01.wav");
	});
	assets.push(GameSounds.AMBIENTE.COWBOYS);

	//COWGIRL WIN
	gSoundManager.loadAsync("sounds/cowboywin.mp3", function (so) {
		GameSounds.WIN.COWBOYS = so;
		loaded("cowboywin.mp3");
	});
	assets.push(GameSounds.WIN.COWBOYS);

	//COWGIRL DYING
	gSoundManager.loadAsync("sounds/cowgirldying.wav", function (so) {
		GameSounds.COWGIRL.DeadLeft = so;
		loaded("cowgirldying.wav");
	});
	assets.push(GameSounds.COWGIRL.DeadLeft);

	gSoundManager.loadAsync("sounds/cowgirldying.wav", function (so) {
		GameSounds.COWGIRL.DeadRight = so;
		loaded("cowgirldying.wav");
	});
	assets.push(GameSounds.COWGIRL.DeadRight);


	/* -------------------------------------- NINJA SOUNDS --------------------------------------- */

	//AMBIENTE NINJA
	gSoundManager.loadAsync("sounds/forest-at-dawn.wav", function (so) {
		GameSounds.AMBIENTE.NINJAS = so;
		loaded("forest-at-dawn.wav");
	});
	assets.push(GameSounds.AMBIENTE.NINJAS); 

	//NINJA WIN
	gSoundManager.loadAsync("sounds/winjungle.wav", function (so) {
		GameSounds.WIN.NINJAS = so;
		loaded("winjungle.wav");
	});
	assets.push(GameSounds.WIN.NINJAS); 


	//ATTACK NINJABOY
	gSoundManager.loadAsync("sounds/katana-cut2.mp3", function (so) {
		GameSounds.NINJABOY.AttackRight = so;
		loaded("katana-cut2.mp3");
	});
	assets.push(GameSounds.NINJABOY.AttackRight);
	
	gSoundManager.loadAsync("sounds/katana-cut2.mp3", function (so) {
		GameSounds.NINJABOY.AttackLeft = so;
		loaded("katana-cut2.mp3");
	});
	assets.push(GameSounds.NINJABOY.AttackLeft);


	//ATTACK NINJAGIRL
	gSoundManager.loadAsync("sounds/katana-cut2.mp3", function (so) {
		GameSounds.NINJAGIRL.AttackRight = so;
		loaded("katana-cut2.mp3");
	});
	assets.push(GameSounds.NINJAGIRL.AttackRight);
	
	gSoundManager.loadAsync("sounds/katana-cut2.mp3", function (so) {
		GameSounds.NINJAGIRL.AttackLeft = so;
		loaded("katana-cut2.mp3");
	});
	assets.push(GameSounds.NINJAGIRL.AttackLeft); 


	//NINJABOY DEATH
	gSoundManager.loadAsync("sounds/man-dying.wav", function (so) {
		GameSounds.NINJABOY.DeadLeft = so;
		loaded("man-dying.wav");
	});
	assets.push(GameSounds.NINJABOY.DeadLeft);

	gSoundManager.loadAsync("sounds/man-dying.wav", function (so) {
		GameSounds.NINJABOY.DeadRight = so;
		loaded("man-dying.wav");
	});
	assets.push(GameSounds.NINJABOY.DeadRight);


	//NINJAGIRL DEATH
	gSoundManager.loadAsync("sounds/women-dying.wav", function (so) {
		GameSounds.NINJAGIRL.DeadLeft = so;
		loaded("women-dying.wav");
	});
	assets.push(GameSounds.NINJAGIRL.DeadLeft);

	gSoundManager.loadAsync("sounds/women-dying.wav", function (so) {
		GameSounds.NINJAGIRL.DeadRight = so;
		loaded("women-dying.wav");
	});
	assets.push(GameSounds.NINJAGIRL.DeadRight); 


	/* -------------------------------------- HERO SOUNDS --------------------------------------- */

	//HERO SHOOT STANDING
	gSoundManager.loadAsync("sounds/laser-one-shot-2.wav", function (so) {
		GameSounds.HERO.ShootLeft = so;
		loaded("laser-one-shot-2.wav");
	});
	assets.push(GameSounds.HERO.ShootLeft); 

	gSoundManager.loadAsync("sounds/laser-one-shot-2.wav", function (so) {
		GameSounds.HERO.ShootRight = so;
		loaded("laser-one-shot-2.wav");
	});
	assets.push(GameSounds.HERO.ShootRight); 


	//HERO SHOOT RUNNING
	gSoundManager.loadAsync("sounds/laser-one-shot-2.wav", function (so) {
		GameSounds.HERO.ShootMovingLeft = so;
		loaded("laser-one-shot-2.wav");
	});
	assets.push(GameSounds.HERO.ShootMovingLeft); 

	gSoundManager.loadAsync("sounds/laser-one-shot-2.wav", function (so) {
		GameSounds.HERO.ShootMovingRight = so;
		loaded("laser-one-shot-2.wav");
	});
	assets.push(GameSounds.HERO.ShootMovingRight);


	//HERO MELEE
	gSoundManager.loadAsync("sounds/sword.flac", function (so) {
		GameSounds.HERO.MeleeLeft = so;
		loaded("sword.flac");
	});
	assets.push(GameSounds.HERO.MeleeLeft); 

	gSoundManager.loadAsync("sounds/sword.flac", function (so) {
		GameSounds.HERO.MeleeRight = so;
		loaded("sword.flac");
	});
	assets.push(GameSounds.HERO.MeleeRight);


	//HERO AIR MELEE
	gSoundManager.loadAsync("sounds/sword.flac", function (so) {
		GameSounds.HERO.MeleeAirLeft = so;
		loaded("sword.flac");
	});
	assets.push(GameSounds.HERO.MeleeAirLeft); 

	gSoundManager.loadAsync("sounds/sword.flac", function (so) {
		GameSounds.HERO.MeleeAirRight = so;
		loaded("sword.flac");
	});
	assets.push(GameSounds.HERO.MeleeAirRight);
	
	
	//HERO SHOOT AIR
	gSoundManager.loadAsync("sounds/laser-one-shot-2.wav", function (so) {
		GameSounds.HERO.ShootAirLeft = so;
		loaded("laser-one-shot-2.wav");
	});
	assets.push(GameSounds.HERO.ShootAirLeft); 

	gSoundManager.loadAsync("sounds/laser-one-shot-2.wav", function (so) {
		GameSounds.HERO.ShootAirRight = so;
		loaded("laser-one-shot-2.wav");
	});
	assets.push(GameSounds.HERO.ShootAirRight);


	//HERO DEATH
	gSoundManager.loadAsync("sounds/robotic-death.wav", function (so) {
		GameSounds.HERO.DeadLeft = so;
		loaded("robotic-death.wav");
	});
	assets.push(GameSounds.HERO.DeadLeft); 

	gSoundManager.loadAsync("sounds/robotic-death.wav", function (so) {
		GameSounds.HERO.DeadRight = so;
		loaded("robotic-death.wav");
	});
	assets.push(GameSounds.HERO.DeadRight);

	/* -------------------------------------- LOSE SOUNDS --------------------------------------- */
	
	gSoundManager.loadAsync("sounds/you-lose-evil.wav", function (so) {
		GameSounds.LOSE.GLOBAL = so;
		loaded("you-lose-evil.wav");
	});
	assets.push(GameSounds.LOSE.GLOBAL);

	/* -------------------------------------- WIN SOUNDS --------------------------------------- */

	gSoundManager.loadAsync("sounds/you-win.mp3", function (so) {
		GameSounds.WIN.GLOBAL = so;
		loaded("you-win.mp3");
	});
	assets.push(GameSounds.WIN.GLOBAL);
}

function loaded() {
	assetsLoaded++;

	if (assetsLoaded < assets.length) return;
	assets.splice(0);

	gameState = GameStates.LOADED;

	setupGame();
}

//Cenário 1
function setupGame() {
	level = 1;

	GameSounds.AMBIENTE.ZOMBIES.play(true, 0.1);

	// ajustar os canvas ao tamanho da janela
	canvases.background.canvas.width = window.innerWidth;
	canvases.background.canvas.height = window.innerHeight;
	canvases.entities.canvas.width = window.innerWidth;
	canvases.entities.canvas.height = window.innerHeight;
	canvases.components.canvas.width = window.innerWidth;
	canvases.components.canvas.height = window.innerHeight;

	canvases.background.canvas.fadeIn(1000);

	// A COMPLETAR NO FINAL: AJUSTAR O BACKGROUND DO CANVAS PARA #b8dcfe. É NECESSÁRIO PARA ESTE EXEMPLO
	//canvases.background.canvas.style.backgroundColor = "#b8dcfe";

	//PASSO 2 - Cria-se um elemento canvas para o background. Vai servir para ser desenhado o tile map
	offscreenBackground = document.createElement("canvas");
	offscreenBackground.width = tileBackground.getWidth();
	offscreenBackground.height = tileBackground.getHeight();


	// PASSO 3: desenhar o tiledBackground num canvas em offscreen(não está adicionado no documento HTML)
	// 		  nota: um canvas pode desenhar outro canvas, como se fosse uma imagem
	tileBackground.draw(offscreenBackground.getContext("2d"));

	gameWorld = new GameWorld(0, 0, offscreenBackground.width, offscreenBackground.height);

	camera = new Camera(0, 0, window.innerWidth, window.innerHeight);

	aHero = new Hero(gSpriteSheets['assets//Hero.png'], canvases.entities.canvas.width * 0, canvases.entities.canvas.height * 0.5, GameSounds.HERO);
	entities1.push(aHero);

	aHero.podeDisparar = true;

	// obter info sobre as plataformas;
	let platObjs = tileBackground.getLayerByName("Plat_Collisions").objects;
	let platDead = tileBackground.getLayerByName("Dead_Collisions").objects;
	let pZombieGirl = tileBackground.getLayerByName("ZombieGirl_Location").objects;
	let pZombieBoy = tileBackground.getLayerByName("ZombieBoy_Location").objects;
	let pZombieG = tileBackground.getLayerByName("ZombieGirl_Location1").objects;
	let pZombieB = tileBackground.getLayerByName("ZombieBoy_Location1").objects;

	// criar entidades sem componente visual e adicionar num array. Nota: criar primeiramente a classe
	for (po of platObjs) {
		let aPlataform = new Plataforma(po.x, po.y, po.width, po.height);
		platforms.push(aPlataform);
	}

	for (p of platDead) {
		let dPlatform = new Plataforma(p.x, p.y, p.width, p.height);
		deadPlat.push(dPlatform);
	}

	for (zombieB of pZombieBoy) {
		let zBoy = new ZombieBoy(gSpriteSheets['assets//ZombieBoy.png'], zombieB.x, zombieB.y, zombieB.x, zombieB.x + zombieB.width, GameSounds.ZOMBIE);
		let pZBoy = new Plataforma(zombieB.x, zombieB.y, zombieB.width, zombieB.height);
		zBoy.y = zombieB.y + zombieB.height - zBoy.height * 0.2;
		zombieBoy.push(zBoy);
		entities1.push(zBoy);
		zBoyPlatform.push(pZBoy);
	}

	for (zombieG of pZombieGirl) {
		let zGirl = new ZombieGirl(gSpriteSheets['assets//ZombieGirl.png'], zombieG.x, zombieG.y, zombieG.x, zombieG.x + zombieG.width, GameSounds.ZOMBIE);
		let pZGirl = new Plataforma(zombieG.x, zombieG.y, zombieG.width, zombieG.height);
		zGirl.y = zombieG.y + zombieG.height - zGirl.height * 0.2;
		zombieGirl.push(zGirl);
		entities1.push(zGirl);
		zGirlPlatform.push(pZGirl);
	}

	for (zombieB of pZombieB) {
		let zBoy = new ZombieBoy(gSpriteSheets['assets//ZombieBoy.png'], zombieB.x, zombieB.y, zombieB.x, zombieB.x + zombieB.width, GameSounds.ZOMBIE);
		let pZBoy = new Plataforma(zombieB.x, zombieB.y, zombieB.width, zombieB.height);
		zBoy.y = zombieB.y + zombieB.height - zBoy.height * 0.2;
		zombieBoy1.push(zBoy);
		entities1.push(zBoy);
		zBoyPlatform1.push(pZBoy);
	}

	for (zombieG of pZombieG) {
		let zGirl = new ZombieGirl(gSpriteSheets['assets//ZombieGirl.png'], zombieG.x, zombieG.y, zombieG.x, zombieG.x + zombieG.width, GameSounds.ZOMBIE);
		let pZGirl = new Plataforma(zombieG.x, zombieG.y, zombieG.width, zombieG.height);
		zGirl.y = zombieG.y + zombieG.height - zGirl.height * 0.2;
		zombieGirl1.push(zGirl);
		entities1.push(zGirl);
		zGirlPlatform1.push(pZGirl);
	}

	if(!lostGame) {
		gameTimer = new GameTimer((camera.width >> 1) - 25, 5, 75, 50, canvases.components.ctx, '', "red", "black", "white", render, stopGame);
		gameTimer.start();
		update();
	}

	gameState = GameStates.RUNNING;

	window.addEventListener("keydown", keyDownHandler, false);
	window.addEventListener("keyup", keyUpHandler, false);
}

//Cenário 2
function setupGame2() {
	level = 2;
	GameSounds.AMBIENTE.ZOMBIES.stop();
	GameSounds.AMBIENTE.COWBOYS.play(true, 0.1);

	// ajustar os canvas ao tamanho da janela
	canvases.background.canvas.width = window.innerWidth;
	canvases.background.canvas.height = window.innerHeight;
	canvases.entities.canvas.width = window.innerWidth;
	canvases.entities.canvas.height = window.innerHeight;
	canvases.components.canvas.width = window.innerWidth;
	canvases.components.canvas.height = window.innerHeight;

	canvases.background.canvas.fadeIn(1000);

	// A COMPLETAR NO FINAL: AJUSTAR O BACKGROUND DO CANVAS PARA #b8dcfe. É NECESSÁRIO PARA ESTE EXEMPLO
	//canvases.background.canvas.style.backgroundColor = "#b8dcfe";

	//PASSO 2 - Cria-se um elemento canvas para o background. Vai servir para ser desenhado o tile map
	offscreenBackground = document.createElement("canvas");
	offscreenBackground.width = tileBackground2.getWidth();
	offscreenBackground.height = tileBackground2.getHeight();


	// PASSO 3: desenhar o tiledBackground num canvas em offscreen(não está adicionado no documento HTML)
	// 		  nota: um canvas pode desenhar outro canvas, como se fosse uma imagem
	tileBackground2.draw(offscreenBackground.getContext("2d"));

	gameWorld = new GameWorld(0, 0, offscreenBackground.width, offscreenBackground.height);

	camera = new Camera(0, 0, window.innerWidth, window.innerHeight);

	aHero2 = new Hero(gSpriteSheets['assets//Hero.png'], canvases.entities.canvas.width * 0, canvases.entities.canvas.height, GameSounds.HERO);
	entities2.push(aHero2);

	aHero2.podeDisparar = true;

	// obter info sobre as plataformas;
	let platObjs = tileBackground2.getLayerByName("Plat_Collisions").objects;
	let platDead = tileBackground2.getLayerByName("Dead_Collisions").objects;
	let pCowGirl = tileBackground2.getLayerByName("Cow_Location").objects;
	let pCowGirl2 = tileBackground2.getLayerByName("Cow_Location1").objects;
	let pCowGirl3= tileBackground2.getLayerByName("Cow_Location2").objects;
	let pCowGirl4 = tileBackground2.getLayerByName("Cow_Location3").objects;

	// criar entidades sem componente visual e adicionar num array. Nota: criar primeiramente a classe
	for (po of platObjs) {
		let aPlataform = new Plataforma(po.x, po.y, po.width, po.height);
		platforms1.push(aPlataform);
	}

	for (p of platDead) {
		let dPlatform = new Plataforma(p.x, p.y, p.width, p.height);
		deadPlat1.push(dPlatform);
	}

	for (cowGirl of pCowGirl) {
		let cGirl = new CowGirl(gSpriteSheets['assets//CowGirl.png'], cowGirl.x, cowGirl.y, cowGirl.x, cowGirl.x + cowGirl.width, GameSounds.COWGIRL);
		let pcGirl = new Plataforma(cowGirl.x, cowGirl.y, cowGirl.width, cowGirl.height);
		cGirl.y = cowGirl.y + cowGirl.height - cGirl.height * 0.2;
		cowGirl1.push(cGirl);
		entities2.push(cGirl);
		cPlatform.push(pcGirl);
	}

	for (cowGirl of pCowGirl2) {
		let cGirl = new CowGirl(gSpriteSheets['assets//CowGirl.png'], cowGirl.x, cowGirl.y, cowGirl.x, cowGirl.x + cowGirl.width, GameSounds.COWGIRL);
		let pcGirl = new Plataforma(cowGirl.x, cowGirl.y, cowGirl.width, cowGirl.height);
		cGirl.y = cowGirl.y + cowGirl.height - cGirl.height * 0.2;
		cowGirl2.push(cGirl);
		entities2.push(cGirl);
		cPlatform1.push(pcGirl);
	}

	for (cowGirl of pCowGirl3) {
		let cGirl = new CowGirl(gSpriteSheets['assets//CowGirl.png'], cowGirl.x, cowGirl.y, cowGirl.x, cowGirl.x + cowGirl.width, GameSounds.COWGIRL);
		let pcGirl = new Plataforma(cowGirl.x, cowGirl.y, cowGirl.width, cowGirl.height);
		cGirl.y = cowGirl.y + cowGirl.height - cGirl.height * 0.2;
		cowGirl3.push(cGirl);
		entities2.push(cGirl);
		cPlatform2.push(pcGirl);
	}

	for (cowGirl of pCowGirl4) {
		let cGirl = new CowGirl(gSpriteSheets['assets//CowGirl.png'], cowGirl.x, cowGirl.y, cowGirl.x, cowGirl.x + cowGirl.width, GameSounds.COWGIRL);
		let pcGirl = new Plataforma(cowGirl.x, cowGirl.y, cowGirl.width, cowGirl.height);
		cGirl.y = cowGirl.y + cowGirl.height - cGirl.height * 0.2;
		cowGirl4.push(cGirl);
		entities2.push(cGirl);
		cPlatform3.push(pcGirl);
	}
	
	gameState = GameStates.RUNNING;

	window.addEventListener("keydown", keyDownHandler2, false);
	window.addEventListener("keyup", keyUpHandler2, false);
}

//Cenário 3
function setupGame3() {
	level = 3
	GameSounds.AMBIENTE.COWBOYS.stop();
	GameSounds.AMBIENTE.NINJAS.play(true, 0.1);

	// ajustar os canvas ao tamanho da janela
	canvases.background.canvas.width = window.innerWidth;
	canvases.background.canvas.height = window.innerHeight;
	canvases.entities.canvas.width = window.innerWidth;
	canvases.entities.canvas.height = window.innerHeight;
	canvases.components.canvas.width = window.innerWidth;
	canvases.components.canvas.height = window.innerHeight;

	canvases.background.canvas.fadeIn(1000);

	// A COMPLETAR NO FINAL: AJUSTAR O BACKGROUND DO CANVAS PARA #b8dcfe. É NECESSÁRIO PARA ESTE EXEMPLO
	//canvases.background.canvas.style.backgroundColor = "#b8dcfe";

	//PASSO 2 - Cria-se um elemento canvas para o background. Vai servir para ser desenhado o tile map
	offscreenBackground = document.createElement("canvas");
	offscreenBackground.width = tileBackground3.getWidth();
	offscreenBackground.height = tileBackground3.getHeight();


	// PASSO 3: desenhar o tiledBackground num canvas em offscreen(não está adicionado no documento HTML)
	// 		  nota: um canvas pode desenhar outro canvas, como se fosse uma imagem
	tileBackground3.draw(offscreenBackground.getContext("2d"));

	gameWorld = new GameWorld(0, 0, offscreenBackground.width, offscreenBackground.height);

	camera = new Camera(0, 0, window.innerWidth, window.innerHeight);

	aHero3 = new Hero(gSpriteSheets['assets//Hero.png'], canvases.entities.canvas.width * 0, canvases.entities.canvas.height * 0, GameSounds.HERO);
	entities3.push(aHero3);

	aHero3.podeDisparar = true;

	// obter info sobre as plataformas;
	let platObjs = tileBackground3.getLayerByName("Plat_Collisions").objects;
	let platDead = tileBackground3.getLayerByName("Dead_Collisions").objects;
	let pNinjaGirl = tileBackground3.getLayerByName("NinjaGirl_Location").objects;
	let pNinjaBoy = tileBackground3.getLayerByName("NinjaBoy_Location").objects;
	let pNinjaG = tileBackground3.getLayerByName("NinjaGirl_Location1").objects;
	let pNinjaB = tileBackground3.getLayerByName("NinjaBoy_Location1").objects;
	let pNinjaG1 = tileBackground3.getLayerByName("NinjaGirl_Location2").objects;
	let pNinjaB1 = tileBackground3.getLayerByName("NinjaBoy_Location2").objects;

	// criar entidades sem componente visual e adicionar num array. Nota: criar primeiramente a classe
	for (po of platObjs) {
		let aPlataform = new Plataforma(po.x, po.y, po.width, po.height);
		platforms2.push(aPlataform);
	}

	for (p of platDead) {
		let dPlatform = new Plataforma(p.x, p.y, p.width, p.height);
		deadPlat2.push(dPlatform);
	}

	for (ninjaB of pNinjaBoy) {
		let nBoy = new NinjaBoy(gSpriteSheets['assets//NinjaBoy.png'], ninjaB.x, ninjaB.y, ninjaB.x, ninjaB.x + ninjaB.width, GameSounds.NINJABOY);
		let pNBoy = new Plataforma(ninjaB.x, ninjaB.y, ninjaB.width, ninjaB.height);
		nBoy.y = ninjaB.y + ninjaB.height - nBoy.height * 0.2;
		ninjaBoy.push(nBoy);
		entities3.push(nBoy);
		nBoyPlatform.push(pNBoy);
	}

	for (ninjaG of pNinjaGirl) {
		let nGirl = new NinjaGirl(gSpriteSheets['assets//NinjaGirl.png'], ninjaG.x, ninjaG.y, ninjaG.x, ninjaG.x + ninjaG.width, GameSounds.NINJAGIRL);
		let pNGirl = new Plataforma(ninjaG.x, ninjaG.y, ninjaG.width, ninjaG.height);
		nGirl.y = ninjaG.y + ninjaG.height - nGirl.height * 0.2;
		ninjaGirl.push(nGirl);
		entities3.push(nGirl);
		nGirlPlatform.push(pNGirl);
	}

	for (ninjaB of pNinjaB) {
		let nBoy = new NinjaBoy(gSpriteSheets['assets//NinjaBoy.png'], ninjaB.x, ninjaB.y, ninjaB.x, ninjaB.x + ninjaB.width, GameSounds.NINJABOY);
		let pNBoy = new Plataforma(ninjaB.x, ninjaB.y, ninjaB.width, ninjaB.height);
		nBoy.y = ninjaB.y + ninjaB.height - nBoy.height * 0.2;
		ninjaBoy1.push(nBoy);
		entities3.push(nBoy);
		nBoyPlatform1.push(pNBoy);
	}

	for (ninjaG of pNinjaG) {
		let nGirl = new NinjaGirl(gSpriteSheets['assets//NinjaGirl.png'], ninjaG.x, ninjaG.y, ninjaG.x, ninjaG.x + ninjaG.width, GameSounds.NINJAGIRL);
		let pNGirl = new Plataforma(ninjaG.x, ninjaG.y, ninjaG.width, ninjaG.height);
		nGirl.y = ninjaG.y + ninjaG.height - nGirl.height * 0.2;
		ninjaGirl1.push(nGirl);
		entities3.push(nGirl);
		nGirlPlatform1.push(pNGirl);
	}

	for (ninjaB of pNinjaB1) {
		let nBoy = new NinjaBoy(gSpriteSheets['assets//NinjaBoy.png'], ninjaB.x, ninjaB.y, ninjaB.x, ninjaB.x + ninjaB.width, GameSounds.NINJABOY);
		let pNBoy = new Plataforma(ninjaB.x, ninjaB.y, ninjaB.width, ninjaB.height);
		nBoy.y = ninjaB.y + ninjaB.height - nBoy.height * 0.2;
		ninjaBoy2.push(nBoy);
		entities3.push(nBoy);
		nBoyPlatform2.push(pNBoy);
	}

	for (ninjaG of pNinjaG1) {
		let nGirl = new NinjaGirl(gSpriteSheets['assets//NinjaGirl.png'], ninjaG.x, ninjaG.y, ninjaG.x, ninjaG.x + ninjaG.width, GameSounds.NINJAGIRL);
		let pNGirl = new Plataforma(ninjaG.x, ninjaG.y, ninjaG.width, ninjaG.height);
		nGirl.y = ninjaG.y + ninjaG.height - nGirl.height * 0.2;
		ninjaGirl2.push(nGirl);
		entities3.push(nGirl);
		nGirlPlatform2.push(pNGirl);
	}

	gameState = GameStates.RUNNING;

	window.addEventListener("keydown", keyDownHandler3, false);
	window.addEventListener("keyup", keyUpHandler3, false);
}

// tratamento dos inputs lvl 1
function keyDownHandler(e) {
	var kCode = e.keyCode;
	keys[kCode] = true;
}

function keyUpHandler(e) {
	var kCode = e.keyCode;
	keys[kCode] = false;

	switch(kCode){
		case keyboard.a:
			aHero.podeDisparar = true;
			break;
		case keyboard.s:
			aHero.podeDisparar = true;
			break;
	}
}

// tratamento dos inputs lvl 2
function keyDownHandler2(e) {
	var kCode = e.keyCode;
	keys[kCode] = true;
}

function keyUpHandler2(e) {
	var kCode = e.keyCode;
	keys[kCode] = false;

	switch(kCode){
		case keyboard.a:
			aHero2.podeDisparar = true;
			break;
		case keyboard.s:
			aHero2.podeDisparar = true;
			break;
	}
}

// tratamento dos inputs lvl 3
function keyDownHandler3(e) {
	var kCode = e.keyCode;
	keys[kCode] = true;
}

function keyUpHandler3(e) {
	var kCode = e.keyCode;
	keys[kCode] = false;

	switch(kCode){
		case keyboard.a:
			aHero3.podeDisparar = true;
			break;
		case keyboard.s:
			aHero3.podeDisparar = true;
			break;
	}
}

// Ciclo de jogo. Chamada a cada refrescamento do browser (sempre que possível)
function update() {
	// restrições para as translações. Necessário para não sairmos da representação visual do mundo. Descomentar no final
	if (tx > 0) tx = 0;
	if (tx < -(offscreenBackground.width - window.innerWidth)) tx = -(offscreenBackground.width - window.innerWidth);
	if (ty > 0) ty = 0;
	if (ty <= -(offscreenBackground.height - window.innerHeight)) ty = -(offscreenBackground.height - window.innerHeight);

	if(level == 1){
		moveHero();
		colisions();
		clearArrays();
		
		for (entity of entities1) entity.update();

		animationHandler = requestAnimationFrame(update);
		render();
	} else if(level == 2){
		entities1.splice(0);
		platforms.splice(0);
		deadPlat.splice(0);
		zBoyPlatform.splice(0);
		zGirlPlatform.splice(0);
		zBoyPlatform1.splice(0);
		zGirlPlatform1.splice(0);

		moveHero2();
		colisions2();
		clearArrays();

		for (entity of entities2) entity.update();

		animationHandler = requestAnimationFrame(update);
		render();
	} else if(level == 3){
		entities2.splice(0);
		platforms1.splice(0);
		deadPlat1.splice(0);
		cowGirl1.splice(0);
		cowGirl2.splice(0);
		cowGirl3.splice(0);
		cowGirl4.splice(0);
		cPlatform.splice(0);
		cPlatform1.splice(0);
		cPlatform2.splice(0);
		cPlatform3.splice(0);

		moveHero3();
		colisions3();
		clearArrays();

		for (entity of entities3) entity.update();

		animationHandler = requestAnimationFrame(update);
		render();
	}
}

//movimentar heroi lvl 1
function moveHero() {
	if (aHero.currState != 'DeadRight' && aHero.currState != 'DeadLeft') {
		//Left
		if (keys[keyboard.LEFT] && aHero.isOnGround && !keys[keyboard.RIGHT] && !keys[keyboard.UP] && !keys[keyboard.DOWN] && !keys[keyboard.a] && !keys[keyboard.s]) {
			aHero.accelerationX = -0.2;
			aHero.friction = 1;
			aHero.andarEsq();
		}
		
		//Right
		if (keys[keyboard.RIGHT] && aHero.isOnGround && !keys[keyboard.LEFT] && !keys[keyboard.UP] && !keys[keyboard.DOWN] && !keys[keyboard.a] && !keys[keyboard.s]) {
			aHero.accelerationX = 0.2;
			aHero.friction = 1;
			aHero.andarDir();
		}

		//Up
		if (keys[keyboard.UP] && aHero.isOnGround && !keys[keyboard.LEFT] && !keys[keyboard.RIGHT]) {
			aHero.vy += aHero.jumpForce;
			aHero.isOnGround = false;
			aHero.friction = 1;
			aHero.saltarDir();
		}
		if (keys[keyboard.UP] && aHero.isOnGround && keys[keyboard.LEFT] && !keys[keyboard.RIGHT]) {
			aHero.vy += aHero.jumpForce;
			aHero.isOnGround = false;
			aHero.accelerationX = -0.2;
			aHero.friction = 1;
			aHero.saltarEsq();
		}
		if (keys[keyboard.UP] && aHero.isOnGround && !keys[keyboard.LEFT] && keys[keyboard.RIGHT]) {
			aHero.vy += aHero.jumpForce;
			aHero.isOnGround = false;
			aHero.accelerationX = 0.2;
			aHero.friction = 1;
			aHero.saltarDir();
		}

		//Down
		if (keys[keyboard.DOWN] && aHero.isOnGround && keys[keyboard.LEFT] && !keys[keyboard.RIGHT]) {
			aHero.vy -= aHero.jumpForce;
			aHero.accelerationX = -0.2;
			aHero.friction = 1;
			aHero.deslizarEsq();
		}
		if (keys[keyboard.DOWN] && aHero.isOnGround && !keys[keyboard.LEFT] && keys[keyboard.RIGHT]) {
			aHero.vy -= aHero.jumpForce;
			aHero.accelerationX = 0.2;
			aHero.friction = 1;
			aHero.deslizarDir();
		}

		if(aHero.isOnGround && !keys[keyboard.LEFT] && !keys[keyboard.RIGHT] && !keys[keyboard.UP] && !keys[keyboard.DOWN] && !keys[keyboard.a] && !keys[keyboard.s] && !keys[keyboard.d] && !keys[keyboard.f]) aHero.pararDir();

		//Set the aHero's acceleration, friction and gravity 
		//to zero if none of the arrow keys are being pressed
		if (!keys[keyboard.LEFT] && !keys[keyboard.RIGHT]) {
			aHero.accelerationX = 0;
			aHero.friction = 0.96;
			aHero.gravity = 0.3;
			aHero.vx = 0;
		}

		//Apply the acceleration
		aHero.vx += aHero.accelerationX;
		aHero.vy += aHero.accelerationY;

		//Apply friction
		if (aHero.isOnGround) {
			aHero.vx *= aHero.friction;
		}

		//Apply gravity
		aHero.vy += aHero.gravity;

		//Limit the speed
		//Don't limit the upward speed because it will choke the jump effect.
		if (aHero.vx > aHero.speedLimit) {
			aHero.vx = aHero.speedLimit;
		}
		if (aHero.vx < -aHero.speedLimit) {
			aHero.vx = -aHero.speedLimit;
		}
		if (aHero.vy > aHero.speedLimit * 2) {
			aHero.vy = aHero.speedLimit * 2;
		}

		aHero.x = Math.max(0, Math.min(aHero.x + aHero.vx, gameWorld.width - aHero.width));
		aHero.y = Math.max(0, Math.min(aHero.y + aHero.vy, gameWorld.height - aHero.height));

		if (aHero.x < camera.leftInnerBoundary()) camera.x = Math.floor(aHero.x - (camera.width * 0.25));

		if (aHero.y < camera.topInnerBoundary()) camera.y = Math.floor(aHero.y - (camera.height * 0.25));

		if (aHero.x + aHero.width > camera.rightInnerBoundary()) camera.x = Math.floor(aHero.x + aHero.width - (camera.width * 0.75));

		if (aHero.y + aHero.height > camera.bottomInnerBoundary()) camera.y = Math.floor(aHero.y + aHero.height - (camera.height * 0.75));


		//manter a camara dentro dos limites do mundo
		if (camera.x < gameWorld.x) camera.x = gameWorld.x;
		if (camera.y < gameWorld.y) camera.y = gameWorld.y;
		if (camera.x + camera.width > gameWorld.x + gameWorld.width) camera.x = gameWorld.x + gameWorld.width - camera.width;
		if (camera.y + camera.height > gameWorld.height) camera.y = gameWorld.height - camera.height;

		if (keys[keyboard.d] && aHero.isOnGround && !keys[keyboard.LEFT] && !keys[keyboard.RIGHT]) aHero.atacaEsq();
		
		if (keys[keyboard.f] && aHero.isOnGround && !keys[keyboard.LEFT] && !keys[keyboard.RIGHT]) aHero.atacaDir();

		if (keys[keyboard.a] && aHero.isOnGround && aHero.podeDisparar && aHero.currState != "RunRight" && aHero.currState != "RunLeft" && aHero.currState != "JumpRight" && aHero.currState != "JumpLeft") {
				aHero.podeDisparar = false;
				aHero.dispararEsq();
	
				var aFire = new Fogo(gSpriteSheets['assets//Bala.png'], aHero.x - 20, aHero.y + aHero.height / 3)// criar o fogo
				entities1.push(aFire);
				osFogos.push(aFire);

				var aBullet = new BalaEsq(gSpriteSheets['assets//Hero.png'], aHero.x - 20, aHero.y + aHero.height / 2.5); //cria uma bala
				entities1.push(aBullet);
				asBalas.push(aBullet);
		}

		if (keys[keyboard.s] && aHero.isOnGround && aHero.podeDisparar && aHero.currState != "RunRight" && aHero.currState != "RunLeft" && aHero.currState != "JumpRight" && aHero.currState != "JumpLeft") {
				aHero.podeDisparar = false;
				aHero.dispararDir();
	
				var aFire = new Fogo(gSpriteSheets['assets//Hero.png'], aHero.x + aHero.width + 10, aHero.y + aHero.height / 2.5)// criar o fogo
				entities1.push(aFire);
				osFogos.push(aFire);

				var aBullet = new BalaDrt(gSpriteSheets['assets//Hero.png'], aHero.x + aHero.width + 10, aHero.y + aHero.height / 2.5); //cria uma bala
				entities1.push(aBullet);
				asBalas.push(aBullet);
		}

		if (keys[keyboard.a] && aHero.isOnGround && aHero.podeDisparar && aHero.currState != "IdleRight" && aHero.currState != "IdleLeft" && aHero.currState != "JumpRight" && aHero.currState != "JumpLeft") {
				aHero.podeDisparar = false;
				aHero.dispararCorreEsq();
	
				var aFire = new Fogo(gSpriteSheets['assets//Bala.png'], aHero.x - 20, aHero.y + aHero.height / 3)// criar o fogo
				entities1.push(aFire);
				osFogos.push(aFire);

				var aBullet = new BalaEsq(gSpriteSheets['assets//Hero.png'], aHero.x - 20, aHero.y + aHero.height / 2.5); //cria uma bala
				entities1.push(aBullet);
				asBalas.push(aBullet);
		}

		if (keys[keyboard.s] && aHero.isOnGround && aHero.podeDisparar && aHero.currState != "IdleRight" && aHero.currState != "IdleLeft" && aHero.currState != "JumpRight" && aHero.currState != "JumpLeft") {
				aHero.podeDisparar = false;
				aHero.dispararCorreDir();
	
				var aFire = new Fogo(gSpriteSheets['assets//Hero.png'], aHero.x + aHero.width + 20, aHero.y + aHero.height / 2.5)// criar o fogo
				entities1.push(aFire);
				osFogos.push(aFire);

				var aBullet = new BalaDrt(gSpriteSheets['assets//Hero.png'], aHero.x + aHero.width + 20, aHero.y + aHero.height / 2.5); //cria uma bala
				entities1.push(aBullet);
				asBalas.push(aBullet);
		}

		if (keys[keyboard.a] && !aHero.isOnGround && aHero.podeDisparar && aHero.currState != "RunRight" && aHero.currState != "RunLeft" && aHero.currState != "IdleRight" && aHero.currState != "IdleLeft") {
				aHero.podeDisparar = false;
				aHero.disparaSaltoEsq();
	
				var aFire = new Fogo(gSpriteSheets['assets//Bala.png'], aHero.x - 20, aHero.y + aHero.height / 3)// criar o fogo
				entities1.push(aFire);
				osFogos.push(aFire);

				var aBullet = new BalaEsq(gSpriteSheets['assets//Hero.png'], aHero.x - 20, aHero.y + aHero.height / 2.5); //cria uma bala
				entities1.push(aBullet);
				asBalas.push(aBullet);
		}

		if (keys[keyboard.s] && !aHero.isOnGround && aHero.podeDisparar && aHero.currState != "RunRight" && aHero.currState != "RunLeft" && aHero.currState != "IdleRight" && aHero.currState != "IdleLeft") {
				aHero.podeDisparar = false;
				aHero.disparaSaltoDir();
	
				var aFire = new Fogo(gSpriteSheets['assets//Hero.png'], aHero.x + aHero.width + 10, aHero.y + aHero.height / 2.5)// criar o fogo
				entities1.push(aFire);
				osFogos.push(aFire);

				var aBullet = new BalaDrt(gSpriteSheets['assets//Hero.png'], aHero.x + aHero.width + 10, aHero.y + aHero.height / 2.5); //cria uma bala
				entities1.push(aBullet);
				asBalas.push(aBullet);
		}
	}
}

//movimentar heroi lvl 2
function moveHero2() {
	if (aHero2.currState != 'DeadRight' && aHero2.currState != 'DeadLeft') {
		//Left
		if (keys[keyboard.LEFT] && aHero2.isOnGround && !keys[keyboard.RIGHT] && !keys[keyboard.UP] && !keys[keyboard.DOWN] && !keys[keyboard.a] && !keys[keyboard.s]) {
			aHero2.accelerationX = -0.2;
			aHero2.friction = 1;
			aHero2.andarEsq();
		}
		
		//Right
		if (keys[keyboard.RIGHT] && aHero2.isOnGround && !keys[keyboard.LEFT] && !keys[keyboard.UP] && !keys[keyboard.DOWN] && !keys[keyboard.a] && !keys[keyboard.s]) {
			aHero2.accelerationX = 0.2;
			aHero2.friction = 1;
			aHero2.andarDir();
		}

		//Up
		if (keys[keyboard.UP] && aHero2.isOnGround && !keys[keyboard.LEFT] && !keys[keyboard.RIGHT]) {
			aHero2.vy += aHero2.jumpForce;
			aHero2.isOnGround = false;
			aHero2.friction = 1;
			aHero2.saltarDir();
		}
		if (keys[keyboard.UP] && aHero2.isOnGround && keys[keyboard.LEFT] && !keys[keyboard.RIGHT]) {
			aHero2.vy += aHero2.jumpForce;
			aHero2.isOnGround = false;
			aHero2.accelerationX = -0.2;
			aHero2.friction = 1;
			aHero2.saltarEsq();
		}
		if (keys[keyboard.UP] && aHero2.isOnGround && !keys[keyboard.LEFT] && keys[keyboard.RIGHT]) {
			aHero2.vy += aHero2.jumpForce;
			aHero2.isOnGround = false;
			aHero2.accelerationX = 0.2;
			aHero2.friction = 1;
			aHero2.saltarDir();
		}

		//Down
		if (keys[keyboard.DOWN] && aHero2.isOnGround && keys[keyboard.LEFT] && !keys[keyboard.RIGHT]) {
			aHero2.vy -= aHero2.jumpForce;
			aHero2.accelerationX = -0.2;
			aHero2.friction = 1;
			aHero2.deslizarEsq();
		}
		if (keys[keyboard.DOWN] && aHero2.isOnGround && !keys[keyboard.LEFT] && keys[keyboard.RIGHT]) {
			aHero2.vy -= aHero2.jumpForce;
			aHero2.accelerationX = 0.2;
			aHero2.friction = 1;
			aHero2.deslizarDir();
		}

		if(aHero2.isOnGround && !keys[keyboard.LEFT] && !keys[keyboard.RIGHT] && !keys[keyboard.UP] && !keys[keyboard.DOWN] && !keys[keyboard.a] && !keys[keyboard.s] && !keys[keyboard.d] && !keys[keyboard.f]) aHero2.pararDir();

		//Set the aHero2's acceleration, friction and gravity 
		//to zero if none of the arrow keys are being pressed
		if (!keys[keyboard.LEFT] && !keys[keyboard.RIGHT]) {
			aHero2.accelerationX = 0;
			aHero2.friction = 0.96;
			aHero2.gravity = 0.3;
			aHero2.vx = 0;
		}

		//Apply the acceleration
		aHero2.vx += aHero2.accelerationX;
		aHero2.vy += aHero2.accelerationY;

		//Apply friction
		if (aHero2.isOnGround) {
			aHero2.vx *= aHero2.friction;
		}

		//Apply gravity
		aHero2.vy += aHero2.gravity;

		//Limit the speed
		//Don't limit the upward speed because it will choke the jump effect.
		if (aHero2.vx > aHero2.speedLimit) {
			aHero2.vx = aHero2.speedLimit;
		}
		if (aHero2.vx < -aHero2.speedLimit) {
			aHero2.vx = -aHero2.speedLimit;
		}
		if (aHero2.vy > aHero2.speedLimit * 2) {
			aHero2.vy = aHero2.speedLimit * 2;
		}

		aHero2.x = Math.max(0, Math.min(aHero2.x + aHero2.vx, gameWorld.width - aHero2.width));
		aHero2.y = Math.max(0, Math.min(aHero2.y + aHero2.vy, gameWorld.height - aHero2.height));

		if (aHero2.x < camera.leftInnerBoundary()) camera.x = Math.floor(aHero2.x - (camera.width * 0.25));

		if (aHero2.y < camera.topInnerBoundary()) camera.y = Math.floor(aHero2.y - (camera.height * 0.25));

		if (aHero2.x + aHero2.width > camera.rightInnerBoundary()) camera.x = Math.floor(aHero2.x + aHero2.width - (camera.width * 0.75));

		if (aHero2.y + aHero2.height > camera.bottomInnerBoundary()) camera.y = Math.floor(aHero2.y + aHero2.height - (camera.height * 0.75));


		//manter a camara dentro dos limites do mundo

		if (camera.x < gameWorld.x) camera.x = gameWorld.x;
		if (camera.y < gameWorld.y) camera.y = gameWorld.y;
		if (camera.x + camera.width > gameWorld.x + gameWorld.width) camera.x = gameWorld.x + gameWorld.width - camera.width;
		if (camera.y + camera.height > gameWorld.height) camera.y = gameWorld.height - camera.height;

		if (keys[keyboard.d] && aHero2.isOnGround && !keys[keyboard.LEFT] && !keys[keyboard.RIGHT]) aHero2.atacaEsq();
		
		if (keys[keyboard.f] && aHero2.isOnGround && !keys[keyboard.LEFT] && !keys[keyboard.RIGHT]) aHero2.atacaDir();

		if (keys[keyboard.a] && aHero2.isOnGround && aHero2.podeDisparar && aHero2.currState != "RunRight" && aHero2.currState != "RunLeft" && aHero2.currState != "JumpRight" && aHero2.currState != "JumpLeft") {
				aHero2.podeDisparar = false;
				aHero2.dispararEsq();
	
				var aFire = new Fogo(gSpriteSheets['assets//Bala.png'], aHero2.x - 20, aHero2.y + aHero2.height / 3)// criar o fogo
				entities2.push(aFire);
				osFogos.push(aFire);

				var aBullet = new BalaEsq(gSpriteSheets['assets//Hero.png'], aHero2.x - 20, aHero2.y + aHero2.height / 2.5); //cria uma bala
				entities2.push(aBullet);
				asBalas.push(aBullet);
		}

		if (keys[keyboard.s] && aHero2.isOnGround && aHero2.podeDisparar && aHero2.currState != "RunRight" && aHero2.currState != "RunLeft" && aHero2.currState != "JumpRight" && aHero2.currState != "JumpLeft") {
				aHero2.podeDisparar = false;
				aHero2.dispararDir();
	
				var aFire = new Fogo(gSpriteSheets['assets//Hero.png'], aHero2.x + aHero2.width + 10, aHero2.y + aHero2.height / 2.5)// criar o fogo
				entities2.push(aFire);
				osFogos.push(aFire);

				var aBullet = new BalaDrt(gSpriteSheets['assets//Hero.png'], aHero2.x + aHero2.width + 10, aHero2.y + aHero2.height / 2.5); //cria uma bala
				entities2.push(aBullet);
				asBalas.push(aBullet);
		}

		if (keys[keyboard.a] && aHero2.isOnGround && aHero2.podeDisparar && aHero2.currState != "IdleRight" && aHero2.currState != "IdleLeft" && aHero2.currState != "JumpRight" && aHero2.currState != "JumpLeft") {
				aHero2.podeDisparar = false;
				aHero2.dispararCorreEsq();
	
				var aFire = new Fogo(gSpriteSheets['assets//Bala.png'], aHero2.x - 20, aHero2.y + aHero2.height / 3)// criar o fogo
				entities2.push(aFire);
				osFogos.push(aFire);

				var aBullet = new BalaEsq(gSpriteSheets['assets//Hero.png'], aHero2.x - 20, aHero2.y + aHero2.height / 2.5); //cria uma bala
				entities2.push(aBullet);
				asBalas.push(aBullet);
		}

		if (keys[keyboard.s] && aHero2.isOnGround && aHero2.podeDisparar && aHero2.currState != "IdleRight" && aHero2.currState != "IdleLeft" && aHero2.currState != "JumpRight" && aHero2.currState != "JumpLeft") {
				aHero2.podeDisparar = false;
				aHero2.dispararCorreDir();
	
				var aFire = new Fogo(gSpriteSheets['assets//Hero.png'], aHero2.x + aHero2.width + 20, aHero2.y + aHero2.height / 2.5)// criar o fogo
				entities2.push(aFire);
				osFogos.push(aFire);

				var aBullet = new BalaDrt(gSpriteSheets['assets//Hero.png'], aHero2.x + aHero2.width + 20, aHero2.y + aHero2.height / 2.5); //cria uma bala
				entities2.push(aBullet);
				asBalas.push(aBullet);
		}

		if (keys[keyboard.a] && !aHero2.isOnGround && aHero2.podeDisparar && aHero2.currState != "RunRight" && aHero2.currState != "RunLeft" && aHero2.currState != "IdleRight" && aHero2.currState != "IdleLeft") {
				aHero2.podeDisparar = false;
				aHero2.disparaSaltoEsq();
	
				var aFire = new Fogo(gSpriteSheets['assets//Bala.png'], aHero2.x - 20, aHero2.y + aHero2.height / 3)// criar o fogo
				entities2.push(aFire);
				osFogos.push(aFire);

				var aBullet = new BalaEsq(gSpriteSheets['assets//Hero.png'], aHero2.x - 20, aHero2.y + aHero2.height / 2.5); //cria uma bala
				entities2.push(aBullet);
				asBalas.push(aBullet);
		}

		if (keys[keyboard.s] && !aHero2.isOnGround && aHero2.podeDisparar && aHero2.currState != "RunRight" && aHero2.currState != "RunLeft" && aHero2.currState != "IdleRight" && aHero2.currState != "IdleLeft") {
				aHero2.podeDisparar = false;
				aHero2.disparaSaltoDir();
	
				var aFire = new Fogo(gSpriteSheets['assets//Hero.png'], aHero2.x + aHero2.width + 10, aHero2.y + aHero2.height / 2.5)// criar o fogo
				entities2.push(aFire);
				osFogos.push(aFire);

				var aBullet = new BalaDrt(gSpriteSheets['assets//Hero.png'], aHero2.x + aHero2.width + 10, aHero2.y + aHero2.height / 2.5); //cria uma bala
				entities2.push(aBullet);
				asBalas.push(aBullet);
		}
	}
}

//movimentar heroi lvl 3
function moveHero3() {
	if (aHero3.currState != 'DeadRight' && aHero3.currState != 'DeadLeft') {
		//Left
		if (keys[keyboard.LEFT] && aHero3.isOnGround && !keys[keyboard.RIGHT] && !keys[keyboard.UP] && !keys[keyboard.DOWN] && !keys[keyboard.a] && !keys[keyboard.s]) {
			aHero3.accelerationX = -0.2;
			aHero3.friction = 1;
			aHero3.andarEsq();
		}
		
		//Right
		if (keys[keyboard.RIGHT] && aHero3.isOnGround && !keys[keyboard.LEFT] && !keys[keyboard.UP] && !keys[keyboard.DOWN] && !keys[keyboard.a] && !keys[keyboard.s]) {
			aHero3.accelerationX = 0.2;
			aHero3.friction = 1;
			aHero3.andarDir();
		}

		//Up
		if (keys[keyboard.UP] && aHero3.isOnGround && !keys[keyboard.LEFT] && !keys[keyboard.RIGHT]) {
			aHero3.vy += aHero3.jumpForce;
			aHero3.isOnGround = false;
			aHero3.friction = 1;
			aHero3.saltarDir();
		}
		if (keys[keyboard.UP] && aHero3.isOnGround && keys[keyboard.LEFT] && !keys[keyboard.RIGHT]) {
			aHero3.vy += aHero3.jumpForce;
			aHero3.isOnGround = false;
			aHero3.accelerationX = -0.2;
			aHero3.friction = 1;
			aHero3.saltarEsq();
		}
		if (keys[keyboard.UP] && aHero3.isOnGround && !keys[keyboard.LEFT] && keys[keyboard.RIGHT]) {
			aHero3.vy += aHero3.jumpForce;
			aHero3.isOnGround = false;
			aHero3.accelerationX = 0.2;
			aHero3.friction = 1;
			aHero3.saltarDir();
		}

		//Down
		if (keys[keyboard.DOWN] && aHero3.isOnGround && keys[keyboard.LEFT] && !keys[keyboard.RIGHT]) {
			aHero3.vy -= aHero3.jumpForce;
			aHero3.accelerationX = -0.2;
			aHero3.friction = 1;
			aHero3.deslizarEsq();
		}
		if (keys[keyboard.DOWN] && aHero3.isOnGround && !keys[keyboard.LEFT] && keys[keyboard.RIGHT]) {
			aHero3.vy -= aHero3.jumpForce;
			aHero3.accelerationX = 0.2;
			aHero3.friction = 1;
			aHero3.deslizarDir();
		}

		if(aHero3.isOnGround && !keys[keyboard.LEFT] && !keys[keyboard.RIGHT] && !keys[keyboard.UP] && !keys[keyboard.DOWN] && !keys[keyboard.a] && !keys[keyboard.s] && !keys[keyboard.d] && !keys[keyboard.f]) aHero3.pararDir();

		//Set the aHero3's acceleration, friction and gravity 
		//to zero if none of the arrow keys are being pressed
		if (!keys[keyboard.LEFT] && !keys[keyboard.RIGHT]) {
			aHero3.accelerationX = 0;
			aHero3.friction = 0.96;
			aHero3.gravity = 0.3;
			aHero3.vx = 0;
		}

		//Apply the acceleration
		aHero3.vx += aHero3.accelerationX;
		aHero3.vy += aHero3.accelerationY;

		//Apply friction
		if (aHero3.isOnGround) {
			aHero3.vx *= aHero3.friction;
		}

		//Apply gravity
		aHero3.vy += aHero3.gravity;

		//Limit the speed
		//Don't limit the upward speed because it will choke the jump effect.
		if (aHero3.vx > aHero3.speedLimit) {
			aHero3.vx = aHero3.speedLimit;
		}
		if (aHero3.vx < -aHero3.speedLimit) {
			aHero3.vx = -aHero3.speedLimit;
		}
		if (aHero3.vy > aHero3.speedLimit * 2) {
			aHero3.vy = aHero3.speedLimit * 2;
		}

		aHero3.x = Math.max(0, Math.min(aHero3.x + aHero3.vx, gameWorld.width - aHero3.width));
		aHero3.y = Math.max(0, Math.min(aHero3.y + aHero3.vy, gameWorld.height - aHero3.height));

		if (aHero3.x < camera.leftInnerBoundary()) camera.x = Math.floor(aHero3.x - (camera.width * 0.25));

		if (aHero3.y < camera.topInnerBoundary()) camera.y = Math.floor(aHero3.y - (camera.height * 0.25));

		if (aHero3.x + aHero3.width > camera.rightInnerBoundary()) camera.x = Math.floor(aHero3.x + aHero3.width - (camera.width * 0.75));

		if (aHero3.y + aHero3.height > camera.bottomInnerBoundary()) camera.y = Math.floor(aHero3.y + aHero3.height - (camera.height * 0.75));


		//manter a camara dentro dos limites do mundo

		if (camera.x < gameWorld.x) camera.x = gameWorld.x;
		if (camera.y < gameWorld.y) camera.y = gameWorld.y;
		if (camera.x + camera.width > gameWorld.x + gameWorld.width) camera.x = gameWorld.x + gameWorld.width - camera.width;
		if (camera.y + camera.height > gameWorld.height) camera.y = gameWorld.height - camera.height;

		if (keys[keyboard.d] && aHero3.isOnGround && !keys[keyboard.LEFT] && !keys[keyboard.RIGHT]) aHero3.atacaEsq();
		
		if (keys[keyboard.f] && aHero3.isOnGround && !keys[keyboard.LEFT] && !keys[keyboard.RIGHT]) aHero3.atacaDir();

		if (keys[keyboard.a] && aHero3.isOnGround && aHero3.podeDisparar && aHero3.currState != "RunRight" && aHero3.currState != "RunLeft" && aHero3.currState != "JumpRight" && aHero3.currState != "JumpLeft") {
				aHero3.podeDisparar = false;
				aHero3.dispararEsq();
	
				var aFire = new Fogo(gSpriteSheets['assets//Bala.png'], aHero3.x - 20, aHero3.y + aHero3.height / 3)// criar o fogo
				entities3.push(aFire);
				osFogos.push(aFire);

				var aBullet = new BalaEsq(gSpriteSheets['assets//Hero.png'], aHero3.x - 20, aHero3.y + aHero3.height / 2.5); //cria uma bala
				entities3.push(aBullet);
				asBalas.push(aBullet);
		}

		if (keys[keyboard.s] && aHero3.isOnGround && aHero3.podeDisparar && aHero3.currState != "RunRight" && aHero3.currState != "RunLeft" && aHero3.currState != "JumpRight" && aHero3.currState != "JumpLeft") {
				aHero3.podeDisparar = false;
				aHero3.dispararDir();
	
				var aFire = new Fogo(gSpriteSheets['assets//Hero.png'], aHero3.x + aHero3.width + 10, aHero3.y + aHero3.height / 2.5)// criar o fogo
				entities3.push(aFire);
				osFogos.push(aFire);

				var aBullet = new BalaDrt(gSpriteSheets['assets//Hero.png'], aHero3.x + aHero3.width + 10, aHero3.y + aHero3.height / 2.5); //cria uma bala
				entities3.push(aBullet);
				asBalas.push(aBullet);
		}

		if (keys[keyboard.a] && aHero3.isOnGround && aHero3.podeDisparar && aHero3.currState != "IdleRight" && aHero3.currState != "IdleLeft" && aHero3.currState != "JumpRight" && aHero3.currState != "JumpLeft") {
				aHero3.podeDisparar = false;
				aHero3.dispararCorreEsq();
	
				var aFire = new Fogo(gSpriteSheets['assets//Bala.png'], aHero3.x - 20, aHero3.y + aHero3.height / 3)// criar o fogo
				entities3.push(aFire);
				osFogos.push(aFire);

				var aBullet = new BalaEsq(gSpriteSheets['assets//Hero.png'], aHero3.x - 20, aHero3.y + aHero3.height / 2.5); //cria uma bala
				entities3.push(aBullet);
				asBalas.push(aBullet);
		}

		if (keys[keyboard.s] && aHero3.isOnGround && aHero3.podeDisparar && aHero3.currState != "IdleRight" && aHero3.currState != "IdleLeft" && aHero3.currState != "JumpRight" && aHero3.currState != "JumpLeft") {
				aHero3.podeDisparar = false;
				aHero3.dispararCorreDir();
	
				var aFire = new Fogo(gSpriteSheets['assets//Hero.png'], aHero3.x + aHero3.width + 20, aHero3.y + aHero3.height / 2.5)// criar o fogo
				entities3.push(aFire);
				osFogos.push(aFire);

				var aBullet = new BalaDrt(gSpriteSheets['assets//Hero.png'], aHero3.x + aHero3.width + 20, aHero3.y + aHero3.height / 2.5); //cria uma bala
				entities3.push(aBullet);
				asBalas.push(aBullet);
		}

		if (keys[keyboard.a] && !aHero3.isOnGround && aHero3.podeDisparar && aHero3.currState != "RunRight" && aHero3.currState != "RunLeft" && aHero3.currState != "IdleRight" && aHero3.currState != "IdleLeft") {
				aHero3.podeDisparar = false;
				aHero3.disparaSaltoEsq();
	
				var aFire = new Fogo(gSpriteSheets['assets//Bala.png'], aHero3.x - 20, aHero3.y + aHero3.height / 3)// criar o fogo
				entities3.push(aFire);
				osFogos.push(aFire);

				var aBullet = new BalaEsq(gSpriteSheets['assets//Hero.png'], aHero3.x - 20, aHero3.y + aHero3.height / 2.5); //cria uma bala
				entities3.push(aBullet);
				asBalas.push(aBullet);
		}

		if (keys[keyboard.s] && !aHero3.isOnGround && aHero3.podeDisparar && aHero3.currState != "RunRight" && aHero3.currState != "RunLeft" && aHero3.currState != "IdleRight" && aHero3.currState != "IdleLeft") {
				aHero3.podeDisparar = false;
				aHero3.disparaSaltoDir();
	
				var aFire = new Fogo(gSpriteSheets['assets//Hero.png'], aHero3.x + aHero3.width + 10, aHero3.y + aHero3.height / 2.5)// criar o fogo
				entities3.push(aFire);
				osFogos.push(aFire);

				var aBullet = new BalaDrt(gSpriteSheets['assets//Hero.png'], aHero3.x + aHero3.width + 10, aHero3.y + aHero3.height / 2.5); //cria uma bala
				entities3.push(aBullet);
				asBalas.push(aBullet);
		}
	}
}

//colisoes lvl 1
function colisions() {

	if (aHero.right() == offscreenBackground.width) {
		aHero.x = offscreenBackground.width - aHero.width;// vais buscar o que ta a direita do boneco
		winLevel1();
	}
	if (aHero.left() < 0) aHero.x = 0;// vais buscar o que ta a esquerda do boneco
	if (aHero.bottom() < 0) aHero.y = 0 - aHero.height;
	if (aHero.top() > offscreenBackground.height - aHero.height) aHero.y = offscreenBackground.height - aHero.height;

	for (var p of platforms) {
		//Check for a collision with the box
		var collisionSide = aHero.blockRectangle(p);

		if (collisionSide === "BOTTOM" && aHero.vy >= 0) {
			//Tell the game that the cat is on the ground if 
			//it's standing on top of a platform
			aHero.isOnGround = true;
			//Neutralize gravity by applying its
			//exact opposite force to the character's vy
			aHero.vy = -aHero.gravity;
		}
		else if (collisionSide === "TOP" && aHero.vy <= 0) aHero.vy = 0;

		else if (collisionSide === "RIGHT" && aHero.vx >= 0) aHero.vx = 0;

		else if (collisionSide === "LEFT" && aHero.vx <= 0) aHero.vx = 0;

		if (collisionSide !== "BOTTOM" && aHero.vy > 0) aHero.isOnGround = false;

		//Bounce off the screen edges
		//Left
		if (aHero.x < 0) {
			aHero.vx *= aHero.bounce;
			aHero.x = 0;
		}
		//Top
		if (aHero.y < 0) {
			aHero.vy *= aHero.bounce;
			aHero.y = 0;
		}
		//Right
		if (aHero.x + aHero.width > offscreenBackground.width) {
			aHero.vx *= aHero.bounce;
			aHero.x = offscreenBackground.width - aHero.width;
		}
		//Bottom
		if (aHero.y + aHero.height > offscreenBackground.height) {
			aHero.vy *= aHero.bounce;
			aHero.y = offscreenBackground.height - aHero.height;
			aHero.isOnGround = true;
			aHero.vy = -aHero.gravity;
		}
	}

	for (var p of deadPlat) {
		//Check for a collision with the box
		if (aHero.hitTestRectangle(p) && aHero.vy >= 0) {
			if (aHero.currState == "RunRight") {
				aHero.morrerDir();
				loseGame();
			} else if (aHero.currState == "RunLeft") {
				aHero.morrerEsq();
				loseGame();
			} else if (aHero.currState == "IdleLeft") {
				aHero.morrerEsq();
				loseGame();
			} else if (aHero.currState == "IdleRight") {
				aHero.morrerDir();
				loseGame();
			} else if (aHero.currState == "JumpLeft") {
				aHero.morrerEsq();
				loseGame();
			} else if (aHero.currState == "JumpRight") {
				aHero.morrerDir();
				loseGame();
			}
		}

		//Bounce off the screen edges
		//Left
		if (aHero.x < 0) {
			aHero.vx *= aHero.bounce;
			aHero.x = 0;
		}
		//Top
		if (aHero.y < 0) {
			aHero.vy *= aHero.bounce;
			aHero.y = 0;
		}
		//Right
		if (aHero.x + aHero.width > offscreenBackground.width) {
			aHero.vx *= aHero.bounce;
			aHero.x = offscreenBackground.width - aHero.width;
		}
		//Bottom
		if (aHero.y + aHero.height > offscreenBackground.height) {
			aHero.vy *= aHero.bounce;
			aHero.y = offscreenBackground.height - aHero.height;
			aHero.isOnGround = true;
			aHero.vy = -aHero.gravity;
		}
	}

	for (var zb of zombieBoy) {
		if (aHero.hitTestRectangle(zb)) {
			if (zb.currState != 'DeadRight' && zb.currState != 'DeadLeft') {
				if (aHero.currState == "RunRight") {
					zb.atacarEsq();
					zb.vx = 0;
					aHero.morrerDir();
					loseGame();
				} else if (aHero.currState == "RunLeft") {
					zb.atacarDir();
					zb.vx = 0;
					aHero.morrerEsq();
					loseGame();
				} else if (aHero.currState == "IdleLeft") {
					zb.atacarDir();
					zb.vx = 0;
					aHero.morrerEsq();
					loseGame();
				} else if (aHero.currState == "IdleRight") {
					zb.atacarEsq();
					zb.vx = 0;
					aHero.morrerDir();
					loseGame();
				}
				else if (aHero.currState == "MeleeLeft") zb.morrerDir();
				
				else if (aHero.currState == "MeleeRight") zb.morrerEsq();
			}
		}
	}

	for (var zg of zombieGirl) {
		if (aHero.hitTestRectangle(zg)) {
			if (zg.currState != 'DeadRight' && zg.currState != 'DeadLeft') {
				if (aHero.currState == "RunRight") {
					zg.atacarEsq();
					zg.vx = 0;
					aHero.morrerDir();
					loseGame();
				} else if (aHero.currState == "RunLeft") {
					zg.atacarDir();
					zg.vx = 0;
					aHero.morrerEsq();
					loseGame();
				} else if (aHero.currState == "IdleLeft") {
					zg.atacarDir();
					zg.vx = 0;
					aHero.morrerEsq();
					loseGame();
				} else if (aHero.currState == "IdleRight") {
					zg.atacarEsq();
					zg.vx = 0;
					aHero.morrerDir();
					loseGame();
				}
				else if (aHero.currState == "MeleeLeft") zg.morrerDir();
					
				else if (aHero.currState == "MeleeRight") zg.morrerEsq();
			}
		}
	}

	for (var zb1 of zombieBoy1) {
		if (aHero.hitTestRectangle(zb1)) {
			if (zb1.currState != 'DeadRight' && zb1.currState != 'DeadLeft') {
				if (aHero.currState == "RunRight") {
					zb1.atacarEsq();
					zb1.vx = 0;
					aHero.morrerDir();
					loseGame();
				} else if (aHero.currState == "RunLeft") {
					zb1.atacarDir();
					zb1.vx = 0;
					aHero.morrerEsq();
					loseGame();
				} else if (aHero.currState == "IdleLeft") {
					zb1.atacarDir();
					zb1.vx = 0;
					aHero.morrerEsq();
					loseGame();
				} else if (aHero.currState == "IdleRight") {
					zb1.atacarEsq();
					zb1.vx = 0;
					aHero.morrerDir();
					loseGame();
				}	
				else if (aHero.currState == "MeleeLeft") zb1.morrerDir();
					
				else if (aHero.currState == "MeleeRight") zb1.morrerEsq();
			}
		}
	}

	for (var zg1 of zombieGirl1) {
		if (aHero.hitTestRectangle(zg1)) {
			if (zg1.currState != 'DeadRight' && zg1.currState != 'DeadLeft') {
				if (aHero.currState == "RunRight") {
					zg1.atacarEsq();
					zg1.vx = 0;
					aHero.morrerDir();
					loseGame();
				} else if (aHero.currState == "RunLeft") {
					zg1.atacarDir();
					zg1.vx = 0;
					aHero.morrerEsq();
					loseGame();
				} else if (aHero.currState == "IdleLeft") {
					zg1.atacarDir();
					zg1.vx = 0;
					aHero.morrerEsq();
					loseGame();
				} else if (aHero.currState == "IdleRight") {
					zg1.atacarEsq();
					zg1.vx = 0;
					aHero.morrerDir();
					loseGame();
				}
				else if (aHero.currState == "MeleeLeft") zg1.morrerDir();
					
				else if (aHero.currState == "MeleeRight") zg1.morrerEsq();
			}
		}
	}

	for (var zb of zombieBoy){
		for(var i=0; i < asBalas.length; i++){
			if (zb.currState != 'DeadRight' && zb.currState != 'DeadLeft') {
				if(zb.hitTestRectangle(asBalas[i]) && !zb.isColliding && !asBalas[i].isColliding){
					zb.isColliding = true;
					asBalas[i].isColliding = true;
					if(zb.currState == 'WalkRight'){
						zb.morrerDir();
					}else if(zb.currState == 'WalkLeft'){
						zb.morrerEsq();
					}
					zb.killed = true;
					asBalas[i].explodir();
				}/*else{
					asBalas[i].isColliding = false;
				}*/
			}
		}
	}

	for (var zg of zombieGirl){
		for(var i=0; i < asBalas.length; i++){
			if (zg.currState != 'DeadRight' && zg.currState != 'DeadLeft') {
				if(zg.hitTestRectangle(asBalas[i]) && !zg.isColliding && !asBalas[i].isColliding){
					zg.isColliding = true;
					asBalas[i].isColliding = true;
					if(zg.currState == 'WalkRight'){
						zg.morrerDir();
					}else if(zg.currState == 'WalkLeft'){
						zg.morrerEsq();
					}
					zg.killed = true;
					asBalas[i].explodir();
				}/*else{
					asBalas[i].isColliding = false;
				}*/
			}
		}
	}

	for (var zg1 of zombieGirl1){
		for(var i=0; i < asBalas.length; i++){
			if (zg1.currState != 'DeadRight' && zg1.currState != 'DeadLeft') {
				if(zg1.hitTestRectangle(asBalas[i]) && !zg1.isColliding && !asBalas[i].isColliding){
					zg1.isColliding = true;
					asBalas[i].isColliding = true;
					if(zg1.currState == 'WalkRight'){
						zg1.morrerDir();
					}else if(zg1.currState == 'WalkLeft'){
						zg1.morrerEsq();
					}
					zg1.killed = true;
					asBalas[i].explodir();
				}/*else{
					asBalas[i].isColliding = false;
				}*/
			}
		}
	}

	for (var zb1 of zombieBoy1){
		for(var i=0; i < asBalas.length; i++){
			if (zb1.currState != 'DeadRight' && zb1.currState != 'DeadLeft') {
				if(zb1.hitTestRectangle(asBalas[i]) && !zb1.isColliding && !asBalas[i].isColliding){
					zb1.isColliding = true;
					asBalas[i].isColliding = true;
					if(zb1.currState == 'WalkRight'){
						zb1.morrerDir();
					}else if(zb1.currState == 'WalkLeft'){
						zb1.morrerEsq();
					}
					zb1.killed = true;
					asBalas[i].explodir();
				}/*else{
					asBalas[i].isColliding = false;
				}*/
			}
		}
	}
}

//colisoes lvl 2
function colisions2() {

	if (aHero2.right() == offscreenBackground.width) {
		aHero2.x = offscreenBackground.width - aHero2.width;// vais buscar o que ta a direita do boneco
		winLevel2();
	}
	if (aHero2.left() < 0) aHero2.x = 0;// vais buscar o que ta a esquerda do boneco
	if (aHero2.bottom() < 0) aHero2.y = 0 - aHero2.height;
	if (aHero2.top() > offscreenBackground.height - aHero2.height) aHero2.y = offscreenBackground.height - aHero2.height;

	for (var p of platforms1) {
		//Check for a collision with the box
		var collisionSide = aHero2.blockRectangle(p);

		if (collisionSide === "BOTTOM" && aHero2.vy >= 0) {
			//Tell the game that the cat is on the ground if 
			//it's standing on top of a platform
			aHero2.isOnGround = true;
			//Neutralize gravity by applying its
			//exact opposite force to the character's vy
			aHero2.vy = -aHero2.gravity;
		}
		else if (collisionSide === "TOP" && aHero2.vy <= 0) aHero2.vy = 0;

		else if (collisionSide === "RIGHT" && aHero2.vx >= 0) aHero2.vx = 0;

		else if (collisionSide === "LEFT" && aHero2.vx <= 0) aHero2.vx = 0;

		if (collisionSide !== "BOTTOM" && aHero2.vy > 0) aHero2.isOnGround = false;

		//Bounce off the screen edges
		//Left
		if (aHero2.x < 0) {
			aHero2.vx *= aHero2.bounce;
			aHero2.x = 0;
		}
		//Top
		if (aHero2.y < 0) {
			aHero2.vy *= aHero2.bounce;
			aHero2.y = 0;
		}
		//Right
		if (aHero2.x + aHero2.width > offscreenBackground.width) {
			aHero2.vx *= aHero2.bounce;
			aHero2.x = offscreenBackground.width - aHero2.width;
		}
		//Bottom
		if (aHero2.y + aHero2.height > offscreenBackground.height) {
			aHero2.vy *= aHero2.bounce;
			aHero2.y = offscreenBackground.height - aHero2.height;
			aHero2.isOnGround = true;
			aHero2.vy = -aHero2.gravity;
		}
	}

	for (var p of deadPlat1) {
		//Check for a collision with the box
		if (aHero2.hitTestRectangle(p) && aHero2.vy >= 0) {
			if (aHero2.currState == "RunRight") {
				aHero2.morrerDir();
				loseGame();
			} else if (aHero2.currState == "RunLeft") {
				aHero2.morrerEsq();
				loseGame();
			} else if (aHero2.currState == "IdleLeft") {
				aHero2.morrerEsq();
				loseGame();
			} else if (aHero2.currState == "IdleRight") {
				aHero2.morrerDir();
				loseGame();
			} else if (aHero2.currState == "JumpLeft") {
				aHero2.morrerEsq();
				loseGame();
			} else if (aHero2.currState == "JumpRight") {
				aHero2.morrerDir();
				loseGame();
			}
		}

		//Bounce off the screen edges
		//Left
		if (aHero2.x < 0) {
			aHero2.vx *= aHero2.bounce;
			aHero2.x = 0;
		}
		//Top
		if (aHero2.y < 0) {
			aHero2.vy *= aHero2.bounce;
			aHero2.y = 0;
		}
		//Right
		if (aHero2.x + aHero2.width > offscreenBackground.width) {
			aHero2.vx *= aHero2.bounce;
			aHero2.x = offscreenBackground.width - aHero2.width;
		}
		//Bottom
		if (aHero2.y + aHero2.height > offscreenBackground.height) {
			aHero2.vy *= aHero2.bounce;
			aHero2.y = offscreenBackground.height - aHero2.height;
			aHero2.isOnGround = true;
			aHero2.vy = -aHero2.gravity;
		}
	}

	for (var cg1 of cowGirl1) {
		if (aHero2.hitTestRectangle(cg1)) {
			if (cg1.currState != 'DeadRight' && cg1.currState != 'DeadLeft') {
				if (aHero2.currState == "RunRight") {
					cg1.atacarEsq();
					cg1.vx = 0;
					aHero2.morrerDir();
					loseGame();
				} else if (aHero2.currState == "RunLeft") {
					cg1.atacarDir();
					cg1.vx = 0;
					aHero2.morrerEsq();
					loseGame();
				} else if (aHero2.currState == "IdleLeft") {
					cg1.atacarDir();
					cg1.vx = 0;
					aHero2.morrerEsq();
					loseGame();
				} else if (aHero2.currState == "IdleRight") {
					cg1.atacarEsq();
					cg1.vx = 0;
					aHero2.morrerDir();
					loseGame();
				}
				else if (aHero2.currState == "MeleeLeft") cg1.morrerDir();
				
				else if (aHero2.currState == "MeleeRight") cg1.morrerEsq();
			}
		}
	}

	for (var cg2 of cowGirl2) {
		if (aHero2.hitTestRectangle(cg2)) {
			if (cg2.currState != 'DeadRight' && cg2.currState != 'DeadLeft') {
				if (aHero2.currState == "RunRight") {
					cg2.atacarEsq();
					cg2.vx = 0;
					aHero2.morrerDir();
					loseGame();
				} else if (aHero2.currState == "RunLeft") {
					cg2.atacarDir();
					cg2.vx = 0;
					aHero2.morrerEsq();
					loseGame();
				} else if (aHero2.currState == "IdleLeft") {
					cg2.atacarDir();
					cg2.vx = 0;
					aHero2.morrerEsq();
					loseGame();
				} else if (aHero2.currState == "IdleRight") {
					cg2.atacarEsq();
					cg2.vx = 0;
					aHero2.morrerDir();
					loseGame();
				}
				else if (aHero2.currState == "MeleeLeft") cg2.morrerDir();
					
				else if (aHero2.currState == "MeleeRight") cg2.morrerEsq();
			}
		}
	}

	for (var cg3 of cowGirl3) {
		if (aHero2.hitTestRectangle(cg3)) {
			if (cg3.currState != 'DeadRight' && cg3.currState != 'DeadLeft') {
				if (aHero2.currState == "RunRight") {
					cg3.atacarEsq();
					cg3.vx = 0;
					aHero2.morrerDir();
					loseGame();
				} else if (aHero2.currState == "RunLeft") {
					cg3.atacarDir();
					cg3.vx = 0;
					aHero2.morrerEsq();
					loseGame();
				} else if (aHero2.currState == "IdleLeft") {
					cg3.atacarDir();
					cg3.vx = 0;
					aHero2.morrerEsq();
					loseGame();
				} else if (aHero2.currState == "IdleRight") {
					cg3.atacarEsq();
					cg3.vx = 0;
					aHero2.morrerDir();
					loseGame();
				}	
				else if (aHero2.currState == "MeleeLeft") cg3.morrerDir();
					
				else if (aHero2.currState == "MeleeRight") cg3.morrerEsq();
			}
		}
	}

	for (var cg4 of cowGirl4) {
		if (aHero2.hitTestRectangle(cg4)) {
			if (cg4.currState != 'DeadRight' && cg4.currState != 'DeadLeft') {
				if (aHero2.currState == "RunRight") {
					cg4.atacarEsq();
					cg4.vx = 0;
					aHero2.morrerDir();
					loseGame();
				} else if (aHero2.currState == "RunLeft") {
					cg4.atacarDir();
					cg4.vx = 0;
					aHero2.morrerEsq();
					loseGame();
				} else if (aHero2.currState == "IdleLeft") {
					cg4.atacarDir();
					cg4.vx = 0;
					aHero2.morrerEsq();
					loseGame();
				} else if (aHero2.currState == "IdleRight") {
					cg4.atacarEsq();
					cg4.vx = 0;
					aHero2.morrerDir();
					loseGame();
				}
				else if (aHero2.currState == "MeleeLeft") cg4.morrerDir();
					
				else if (aHero2.currState == "MeleeRight") cg4.morrerEsq();
			}
		}
	}

	for (var cg1 of cowGirl1){
		for(var i=0; i < asBalas.length; i++){
			if (cg1.currState != 'DeadRight' && cg1.currState != 'DeadLeft') {
				if(cg1.hitTestRectangle(asBalas[i]) && !cg1.isColliding && !asBalas[i].isColliding){
					cg1.isColliding = true;
					asBalas[i].isColliding = true;
					if(cg1.currState == 'RunRight'){
						cg1.morrerDir();
					}else if(cg1.currState == 'RunLeft'){
						cg1.morrerEsq();
					}
					cg1.killed = true;
					asBalas[i].explodir();
				}/*else{
					asBalas[i].isColliding = false;
				}*/
			}
		}
	}

	for (var cg2 of cowGirl2){
		for(var i=0; i < asBalas.length; i++){
			if (cg2.currState != 'DeadRight' && cg2.currState != 'DeadLeft') {
				if(cg2.hitTestRectangle(asBalas[i]) && !cg2.isColliding && !asBalas[i].isColliding){
					cg2.isColliding = true;
					asBalas[i].isColliding = true;
					if(cg2.currState == 'RunRight'){
						cg2.morrerDir();
					}else if(cg2.currState == 'RunLeft'){
						cg2.morrerEsq();
					}
					cg2.killed = true;
					asBalas[i].explodir();
				}/*else{
					asBalas[i].isColliding = false;
				}*/
			}
		}
	}

	for (var cg3 of cowGirl3){
		for(var i=0; i < asBalas.length; i++){
			if (cg3.currState != 'DeadRight' && cg3.currState != 'DeadLeft') {
				if(cg3.hitTestRectangle(asBalas[i]) && !cg3.isColliding && !asBalas[i].isColliding){
					cg3.isColliding = true;
					asBalas[i].isColliding = true;
					if(cg3.currState == 'RunRight'){
						cg3.morrerDir();
					}else if(cg3.currState == 'RunLeft'){
						cg3.morrerEsq();
					}
					cg3.killed = true;
					asBalas[i].explodir();
				}/*else{
					asBalas[i].isColliding = false;
				}*/
			}
		}
	}

	for (var cg4 of cowGirl4){
		for(var i=0; i < asBalas.length; i++){
			if (cg4.currState != 'DeadRight' && cg4.currState != 'DeadLeft') {
				if(cg4.hitTestRectangle(asBalas[i]) && !cg4.isColliding && !asBalas[i].isColliding){
					cg4.isColliding = true;
					asBalas[i].isColliding = true;
					if(cg4.currState == 'RunRight'){
						cg4.morrerDir();
					}else if(cg4.currState == 'RunLeft'){
						cg4.morrerEsq();
					}
					cg4.killed = true;
					asBalas[i].explodir();
				}/*else{
					asBalas[i].isColliding = false;
				}*/
			}
		}
	}
}

//colisoes lvl 3
function colisions3() {

	if (aHero3.right() == offscreenBackground.width) {
		aHero3.x = offscreenBackground.width - aHero3.width;// vais buscar o que ta a direita do boneco
		winLevel3();
	}
	if (aHero3.left() < 0) aHero3.x = 0;// vais buscar o que ta a esquerda do boneco
	if (aHero3.bottom() < 0) aHero3.y = 0 - aHero3.height;
	if (aHero3.top() > offscreenBackground.height - aHero3.height) aHero3.y = offscreenBackground.height - aHero3.height;

	for (var p of platforms2) {
		//Check for a collision with the box
		var collisionSide = aHero3.blockRectangle(p);

		if (collisionSide === "BOTTOM" && aHero3.vy >= 0) {
			//Tell the game that the cat is on the ground if 
			//it's standing on top of a platform
			aHero3.isOnGround = true;
			//Neutralize gravity by applying its
			//exact opposite force to the character's vy
			aHero3.vy = -aHero3.gravity;
		}
		else if (collisionSide === "TOP" && aHero3.vy <= 0) aHero3.vy = 0;

		else if (collisionSide === "RIGHT" && aHero3.vx >= 0) aHero3.vx = 0;

		else if (collisionSide === "LEFT" && aHero3.vx <= 0) aHero3.vx = 0;

		if (collisionSide !== "BOTTOM" && aHero3.vy > 0) aHero3.isOnGround = false;

		//Bounce off the screen edges
		//Left
		if (aHero3.x < 0) {
			aHero3.vx *= aHero3.bounce;
			aHero3.x = 0;
		}
		//Top
		if (aHero3.y < 0) {
			aHero3.vy *= aHero3.bounce;
			aHero3.y = 0;
		}
		//Right
		if (aHero3.x + aHero3.width > offscreenBackground.width) {
			aHero3.vx *= aHero3.bounce;
			aHero3.x = offscreenBackground.width - aHero3.width;
		}
		//Bottom
		if (aHero3.y + aHero3.height > offscreenBackground.height) {
			aHero3.vy *= aHero3.bounce;
			aHero3.y = offscreenBackground.height - aHero3.height;
			aHero3.isOnGround = true;
			aHero3.vy = -aHero3.gravity;
		}
	}

	for (var p of deadPlat2) {
		//Check for a collision with the box
		if (aHero3.hitTestRectangle(p) && aHero3.vy >= 0) {
			if (aHero3.currState == "RunRight") {
				aHero3.morrerDir();
				loseGame();
			} else if (aHero3.currState == "RunLeft") {
				aHero3.morrerEsq();
				loseGame();
			} else if (aHero3.currState == "IdleLeft") {
				aHero3.morrerEsq();
				loseGame();
			} else if (aHero3.currState == "IdleRight") {
				aHero3.morrerDir();
				loseGame();
			} else if (aHero3.currState == "JumpLeft") {
				aHero3.morrerEsq();
				loseGame();
			} else if (aHero3.currState == "JumpRight") {
				aHero3.morrerDir();
				loseGame();
			}
		}

		//Bounce off the screen edges
		//Left
		if (aHero3.x < 0) {
			aHero3.vx *= aHero3.bounce;
			aHero3.x = 0;
		}
		//Top
		if (aHero3.y < 0) {
			aHero3.vy *= aHero3.bounce;
			aHero3.y = 0;
		}
		//Right
		if (aHero3.x + aHero3.width > offscreenBackground.width) {
			aHero3.vx *= aHero3.bounce;
			aHero3.x = offscreenBackground.width - aHero3.width;
		}
		//Bottom
		if (aHero3.y + aHero3.height > offscreenBackground.height) {
			aHero3.vy *= aHero3.bounce;
			aHero3.y = offscreenBackground.height - aHero3.height;
			aHero3.isOnGround = true;
			aHero3.vy = -aHero3.gravity;
		}
	}

	for (var nb of ninjaBoy) {
		if (aHero3.hitTestRectangle(nb)) {
			if (nb.currState != 'DeadRight' && nb.currState != 'DeadLeft') {
				if (aHero3.currState == "RunRight") {
					nb.atacarEsq();
					nb.vx = 0;
					aHero3.morrerDir();
					loseGame();
				} else if (aHero3.currState == "RunLeft") {
					nb.atacarDir();
					nb.vx = 0;
					aHero3.morrerEsq();
					loseGame();
				} else if (aHero3.currState == "IdleLeft") {
					nb.atacarDir();
					nb.vx = 0;
					aHero3.morrerEsq();
					loseGame();
				} else if (aHero3.currState == "IdleRight") {
					nb.atacarEsq();
					nb.vx = 0;
					aHero3.morrerDir();
					loseGame();
				}
				else if (aHero3.currState == "MeleeLeft") nb.morrerDir();
				
				else if (aHero3.currState == "MeleeRight") nb.morrerEsq();
			}
		}
	}

	for (var ng of ninjaGirl) {
		if (aHero3.hitTestRectangle(ng)) {
			if (ng.currState != 'DeadRight' && ng.currState != 'DeadLeft') {
				if (aHero3.currState == "RunRight") {
					ng.atacarEsq();
					ng.vx = 0;
					aHero3.morrerDir();
					loseGame();
				} else if (aHero3.currState == "RunLeft") {
					ng.atacarDir();
					ng.vx = 0;
					aHero3.morrerEsq();
					loseGame();
				} else if (aHero3.currState == "IdleLeft") {
					ng.atacarDir();
					ng.vx = 0;
					aHero3.morrerEsq();
					loseGame();
				} else if (aHero3.currState == "IdleRight") {
					ng.atacarEsq();
					ng.vx = 0;
					aHero3.morrerDir();
					loseGame();
				}
				else if (aHero3.currState == "MeleeLeft") ng.morrerDir();
					
				else if (aHero3.currState == "MeleeRight") ng.morrerEsq();
			}
		}
	}

	for (var nb1 of ninjaBoy1) {
		if (aHero3.hitTestRectangle(nb1)) {
			if (nb1.currState != 'DeadRight' && nb1.currState != 'DeadLeft') {
				if (aHero3.currState == "RunRight") {
					nb1.atacarEsq();
					nb1.vx = 0;
					aHero3.morrerDir();
					loseGame();
				} else if (aHero3.currState == "RunLeft") {
					nb1.atacarDir();
					nb1.vx = 0;
					aHero3.morrerEsq();
					loseGame();
				} else if (aHero3.currState == "IdleLeft") {
					nb1.atacarDir();
					nb1.vx = 0;
					aHero3.morrerEsq();
					loseGame();
				} else if (aHero3.currState == "IdleRight") {
					nb1.atacarEsq();
					nb1.vx = 0;
					aHero3.morrerDir();
					loseGame();
				}	
				else if (aHero3.currState == "MeleeLeft") nb1.morrerDir();
					
				else if (aHero3.currState == "MeleeRight") nb1.morrerEsq();
			}
		}
	}

	for (var ng1 of ninjaGirl1) {
		if (aHero3.hitTestRectangle(ng1)) {
			if (ng1.currState != 'DeadRight' && ng1.currState != 'DeadLeft') {
				if (aHero3.currState == "RunRight") {
					ng1.atacarEsq();
					ng1.vx = 0;
					aHero3.morrerDir();
					loseGame();
				} else if (aHero3.currState == "RunLeft") {
					ng1.atacarDir();
					ng1.vx = 0;
					aHero3.morrerEsq();
					loseGame();
				} else if (aHero3.currState == "IdleLeft") {
					ng1.atacarDir();
					ng1.vx = 0;
					aHero3.morrerEsq();
					loseGame();
				} else if (aHero3.currState == "IdleRight") {
					ng1.atacarEsq();
					ng1.vx = 0;
					aHero3.morrerDir();
					loseGame();
				}
				else if (aHero3.currState == "MeleeLeft") ng1.morrerDir();
					
				else if (aHero3.currState == "MeleeRight") ng1.morrerEsq();
			}
		}
	}

	for (var nb2 of ninjaBoy2) {
		if (aHero3.hitTestRectangle(nb2)) {
			if (nb2.currState != 'DeadRight' && nb2.currState != 'DeadLeft') {
				if (aHero3.currState == "RunRight") {
					nb2.atacarEsq();
					nb2.vx = 0;
					aHero3.morrerDir();
					loseGame();
				} else if (aHero3.currState == "RunLeft") {
					nb2.atacarDir();
					nb2.vx = 0;
					aHero3.morrerEsq();
					loseGame();
				} else if (aHero3.currState == "IdleLeft") {
					nb2.atacarDir();
					nb2.vx = 0;
					aHero3.morrerEsq();
					loseGame();
				} else if (aHero3.currState == "IdleRight") {
					nb2.atacarEsq();
					nb2.vx = 0;
					aHero3.morrerDir();
					loseGame();
				}	
				else if (aHero3.currState == "MeleeLeft") nb2.morrerDir();
					
				else if (aHero3.currState == "MeleeRight") nb2.morrerEsq();
			}
		}
	}

	for (var ng2 of ninjaGirl2) {
		if (aHero3.hitTestRectangle(ng2)) {
			if (ng2.currState != 'DeadRight' && ng2.currState != 'DeadLeft') {
				if (aHero3.currState == "RunRight") {
					ng2.atacarEsq();
					ng2.vx = 0;
					aHero3.morrerDir();
					loseGame();
				} else if (aHero3.currState == "RunLeft") {
					ng2.atacarDir();
					ng2.vx = 0;
					aHero3.morrerEsq();
					loseGame();
				} else if (aHero3.currState == "IdleLeft") {
					ng2.atacarDir();
					ng2.vx = 0;
					aHero3.morrerEsq();
					loseGame();
				} else if (aHero3.currState == "IdleRight") {
					ng2.atacarEsq();
					ng2.vx = 0;
					aHero3.morrerDir();
					loseGame();
				}
				else if (aHero3.currState == "MeleeLeft") ng2.morrerDir();
					
				else if (aHero3.currState == "MeleeRight") ng2.morrerEsq();
			}
		}
	}

	for (var nb of ninjaBoy){
		for(var i=0; i < asBalas.length; i++){
			if (nb.currState != 'DeadRight' && nb.currState != 'DeadLeft') {
				if(nb.hitTestRectangle(asBalas[i]) && !nb.isColliding && !asBalas[i].isColliding){
					nb.isColliding = true;
					asBalas[i].isColliding = true;
					if(nb.currState == 'RunRight'){
						nb.morrerDir();
					}else if(nb.currState == 'RunLeft'){
						nb.morrerEsq();
					}
					nb.killed = true;
					asBalas[i].explodir();
				}/*else{
					asBalas[i].isColliding = false;
				}*/
			}
		}
	}

	for (var ng of ninjaGirl){
		for(var i=0; i < asBalas.length; i++){
			if (ng.currState != 'DeadRight' && ng.currState != 'DeadLeft') {
				if(ng.hitTestRectangle(asBalas[i]) && !ng.isColliding && !asBalas[i].isColliding){
					ng.isColliding = true;
					asBalas[i].isColliding = true;
					if(ng.currState == 'RunRight'){
						ng.morrerDir();
					}else if(ng.currState == 'RunLeft'){
						ng.morrerEsq();
					}
					ng.killed = true;
					asBalas[i].explodir();
				}/*else{
					asBalas[i].isColliding = false;
				}*/
			}
		}
	}

	for (var ng1 of ninjaGirl1){
		for(var i=0; i < asBalas.length; i++){
			if (ng1.currState != 'DeadRight' && ng1.currState != 'DeadLeft') {
				if(ng1.hitTestRectangle(asBalas[i]) && !ng1.isColliding && !asBalas[i].isColliding){
					ng1.isColliding = true;
					asBalas[i].isColliding = true;
					if(ng1.currState == 'RunRight'){
						ng1.morrerDir();
					}else if(ng1.currState == 'RunLeft'){
						ng1.morrerEsq();
					}
					ng1.killed = true;
					asBalas[i].explodir();
				}/*else{
					asBalas[i].isColliding = false;
				}*/
			}
		}
	}

	for (var nb1 of ninjaBoy1){
		for(var i=0; i < asBalas.length; i++){
			if (nb1.currState != 'DeadRight' && nb1.currState != 'DeadLeft') {
				if(nb1.hitTestRectangle(asBalas[i]) && !nb1.isColliding && !asBalas[i].isColliding){
					nb1.isColliding = true;
					asBalas[i].isColliding = true;
					if(nb1.currState == 'RunRight'){
						nb1.morrerDir();
					}else if(nb1.currState == 'RunLeft'){
						nb1.morrerEsq();
					}
					nb1.killed = true;
					asBalas[i].explodir();
				}/*else{
					asBalas[i].isColliding = false;
				}*/
			}
		}
	}

	for (var ng2 of ninjaGirl2){
		for(var i=0; i < asBalas.length; i++){
			if (ng2.currState != 'DeadRight' && ng2.currState != 'DeadLeft') {
				if(ng2.hitTestRectangle(asBalas[i]) && !ng2.isColliding && !asBalas[i].isColliding){
					ng2.isColliding = true;
					asBalas[i].isColliding = true;
					if(ng2.currState == 'RunRight'){
						ng2.morrerDir();
					}else if(ng2.currState == 'RunLeft'){
						ng2.morrerEsq();
					}
					ng2.killed = true;
					asBalas[i].explodir();
				}/*else{
					asBalas[i].isColliding = false;
				}*/
			}
		}
	}

	for (var nb2 of ninjaBoy2){
		for(var i=0; i < asBalas.length; i++){
			if (nb2.currState != 'DeadRight' && nb2.currState != 'DeadLeft') {
				if(nb2.hitTestRectangle(asBalas[i]) && !nb2.isColliding && !asBalas[i].isColliding){
					nb2.isColliding = true;
					asBalas[i].isColliding = true;
					if(nb2.currState == 'RunRight'){
						nb2.morrerDir();
					}else if(nb2.currState == 'RunLeft'){
						nb2.morrerEsq();
					}
					nb2.killed = true;
					asBalas[i].explodir();
				}/*else{
					asBalas[i].isColliding = false;
				}*/
			}
		}
	}
}

function winLevel1() {
	gameState = GameStates.STOPED
	cancelAnimationFrame(animationHandler);
	lostGame = true;
	setupGame2();
}

function winLevel2() {
	cancelAnimationFrame(animationHandler);
	lostGame = true;
	setupGame3();
}

function winLevel3() {
	aHero.pararDir();	
	cancelAnimationFrame(animationHandler);
	window.removeEventListener("keydown", keyDownHandler3, false);
	window.removeEventListener("keyup", keyUpHandler3, false);

	canvases.background.canvas.colorize("#614719");
	canvases.entities.canvas.colorize("#614719");
	canvases.components.canvas.grayScale();
	canvases.components.canvas.fadeOut(2000);

	gameState = GameStates.STOPED;
	gSoundManager.stopAll();
}

function loseGame() {
	if(level == 1){
		gameState = GameStates.STOPED
		lostGame = true;

		cancelAnimationFrame(animationHandler);

		entities1.splice(0);
		platforms.splice(0);
		deadPlat.splice(0);
		zombieGirl.splice(0);
		zombieBoy.splice(0);
		zombieGirl1.splice(0);
		zombieBoy1.splice(0);
		zBoyPlatform.splice(0);
		zGirlPlatform.splice(0);
		zBoyPlatform1.splice(0);
		zGirlPlatform1.splice(0);

		setupGame();
	} else if(level == 2){
		gameState = GameStates.STOPED
		lostGame = true;

		cancelAnimationFrame(animationHandler);

		entities2.splice(0);
		platforms1.splice(0);
		deadPlat1.splice(0);
		cowGirl1.splice(0);
		cowGirl2.splice(0);
		cowGirl3.splice(0);
		cowGirl4.splice(0);
		cPlatform.splice(0);
		cPlatform1.splice(0);
		cPlatform2.splice(0);
		cPlatform3.splice(0);

		setupGame2();
	} else if(level == 3){
		gameState = GameStates.STOPED
		lostGame = true;
		
		cancelAnimationFrame(animationHandler);

		entities3.splice(0);
		platforms2.splice(0);
		deadPlat2.splice(0);
		ninjaGirl.splice(0);
		ninjaBoy.splice(0);
		ninjaGirl1.splice(0);
		ninjaBoy1.splice(0);
		ninjaGirl2.splice(0);
		ninjaBoy2.splice(0);
		nBoyPlatform.splice(0);
		nGirlPlatform.splice(0)
		nBoyPlatform1.splice(0);
		nGirlPlatform1.splice(0);
		nBoyPlatform2.splice(0);
		nGirlPlatform2.splice(0);

		setupGame3();
	}
}

//função que para o jogo. É chamada pelo timer, quando a contagem chega a zero
function stopGame() {	
	cancelAnimationFrame(animationHandler);
	window.removeEventListener("keydown", keyDownHandler3, false);
	window.removeEventListener("keyup", keyUpHandler3, false);

	canvases.background.canvas.colorize("#614719");
	canvases.entities.canvas.colorize("#614719");
	canvases.components.canvas.grayScale();
	canvases.components.canvas.fadeOut(2000);

	gameState = GameStates.STOPED;
	gameTimer.stop();
	gSoundManager.stopAll();
}

// Limpeza das entidades desativadas
function clearArrays() {
	entities1 = entities1.filter(filterByActiveProp);
	entities2 = entities2.filter(filterByActiveProp);
	entities3 = entities3.filter(filterByActiveProp);
	asBalas = asBalas.filter(filterByActiveProp);
	osFogos = osFogos.filter(filterByActiveProp);
}

function filterByActiveProp(obj) {
	if (obj.active == true) return obj;
}

// Desenho dos elementos gráficos
function render() {	
	canvases.background.ctx.clearRect(0, 0, canvases.background.canvas.width, canvases.background.canvas.height); //limpa o canvas do background
	canvases.entities.ctx.clearRect(0, 0, canvases.entities.canvas.width, canvases.entities.canvas.height); //limpa canvas das entidades
	canvases.background.ctx.save();
	canvases.entities.ctx.save();

	// transladar o canvas de acordo com os offset calculados
	canvases.background.ctx.translate(-camera.x, -camera.y);
	canvases.entities.ctx.translate(-camera.x, -camera.y);

	//desenhar o tilebackground
	canvases.background.ctx.drawImage(offscreenBackground,
		0, 0, offscreenBackground.width, offscreenBackground.height, 0, 0,
		offscreenBackground.width, offscreenBackground.height);

	for (let entity of entities1) {
		if (entity.right() > 0 && entity.bottom() > 0 &&
			entity.left() < offscreenBackground.width && entity.top() < offscreenBackground.height) {
			entity.render(canvases.entities.ctx);
			entity.drawColisionBoundaries(canvases.entities.ctx, true, false, "blue", "red");
		}
	}

	for (let entity of entities2) {
		if (entity.right() > 0 && entity.bottom() > 0 &&
			entity.left() < offscreenBackground.width && entity.top() < offscreenBackground.height) {
			entity.render(canvases.entities.ctx);
		}
	}

	for (let entity of entities3) {
		if (entity.right() > 0 && entity.bottom() > 0 &&
			entity.left() < offscreenBackground.width && entity.top() < offscreenBackground.height) {
			entity.render(canvases.entities.ctx);
		}
	}

	gameTimer.render();

	canvases.background.ctx.restore();
	canvases.entities.ctx.restore();
}