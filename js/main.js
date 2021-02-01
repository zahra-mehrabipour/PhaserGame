
let doshman = true;
function Hero(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'hero');
    this.anchor.set(0.1, 0.8);
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
}
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;
Hero.prototype.move = function (direction) {
    const SPEED = 250;
    this.body.velocity.x = SPEED;
};
Hero.prototype.jump = function beparkhers () {
    const JUMP_SPEED = 980;
    let canJump = this.body.touching.down;
    if (canJump) {
        this.body.velocity.y = -JUMP_SPEED;
        /*this.game.state.restart();*/

    }
    return canJump;
};
Hero.prototype.bounce = function () {
    const BOUNCE_SPEED = 200;
    this.body.velocity.y = -BOUNCE_SPEED;
};
//
// Spider (enemy)
//
function Spider(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'spider')
    // anchor
    this.anchor.set(0.5);
    // animation
    this.animations.add('die', [0, 4, 0, 4, 0, 4, 3, 3, 3, 3, 3, 3], 12);
    // physic properties
    this.game.physics.enable(this);

    this.body.collideWorldBounds = true;
    this.body.velocity.x = Spider.SPEED;
}
Spider.SPEED = 100;
// inherit from Phaser.Sprite
Spider.prototype = Object.create(Phaser.Sprite.prototype);
Spider.prototype.constructor = Spider;
Spider.prototype.update = function () {
    // check against walls and reverse direction if necessary
    if (this.body.touching.right || this.body.blocked.right) {
        this.body.velocity.x = -Spider.SPEED; // turn left
        console.log("zahra")
    }
    else if (this.body.touching.left || this.body.blocked.left) {
        this.body.velocity.x = Spider.SPEED; // turn right
        console.log("زهرا")
        doshman = false;
    }
};
Spider.prototype.die = function () {
    this.body.enable = false;

    this.animations.play('die').onComplete.addOnce(function () {
        this.kill();
    }, this);
};

// =============================================================================
// game states
// =============================================================================
PlayState = {};
PlayState.init = function () {
    this.game.renderer.renderSession.roundPixels = true;
    this.keys = this.game.input.keyboard.addKeys({
        left: Phaser.KeyCode.LEFT,
        right: Phaser.KeyCode.RIGHT,
        up: Phaser.KeyCode.UP
    });
    this.keys.up.onDown.add(function () {
        let didJump = this.hero.jump();
        if (didJump) {
            this.sfx.jump.play();
        }
    }, this);
    this.coinPickupCount = 0;
    this.hasKey = false;
};
PlayState.preload = function () {
    this.game.load.json('level:1', 'data/level01.json');
    this.game.load.image('font:numbers', 'images/numbers.png');
    this.game.load.image('background', 'images/Artboard 1.png');
    this.game.load.image('grass:1x1', 'images/Artboard 2.png');
    this.game.load.image('grass:7x1', 'images/taxi1.png');
    this.game.load.image('grass:7x01', 'images/taxi2.png');
    this.game.load.image('grass:7x10', 'images/taxi3.png');

    this.game.load.image('grass:6x1', 'images/volkwagon-1.png');
    this.game.load.image('grass:6x01', 'images/volkwagon-2.png');
    this.game.load.image('grass:6x10', 'images/volkwagon-3.png');

    this.game.load.image('grass:4x1', 'images/peikan-1.png');
    this.game.load.image('grass:4x01', 'images/peikan-2.png');
    this.game.load.image('grass:4x10', 'images/peikan-3.png');
    this.game.load.image('grass:9x1', 'images/peikan-1.png');
    this.game.load.image('grass:9x01', 'images/peikan-2.png');
    this.game.load.image('grass:9x10', 'images/peikan-3.png');
    this.game.load.image('grass:3x1', 'images/dyane-1.png');
    this.game.load.image('grass:3x01', 'images/dyane-2.png');
    this.game.load.image('grass:3x10', 'images/dyane-3.png');
    this.game.load.image('grass:10x1', 'images/bus.png');
    this.game.load.image('grass:11x1', 'images/Artboard 11.png');
    this.game.load.image('grass:12x1', 'images/Artboard 12.png');
    this.game.load.image('grass:13x1', 'images/Artboard 13.png');
    this.game.load.image('grass:14x1', 'images/Artboard 14.png');
    this.game.load.image('grass:15x1', 'images/Artboard 15.png');
    this.game.load.image('grass:16x1', 'images/Artboard 16.png');
    this.game.load.image('grass:17x1', 'images/Artboard 17.png');
    this.game.load.image('grass:18x1', 'images/Artboard 18.png');
    this.game.load.image('hero', 'images/hero_stopped.png', 200, 100);
    this.game.load.image('invisible-wall', 'images/invisible_wall.png');
    this.game.load.image('icon:coin', 'images/coin_icon.png');
    this.game.load.image('key', 'images/50.png');
    this.game.load.spritesheet('door', 'images/door.png', 1, 1);
    this.game.load.spritesheet('coin', 'images/3coin_animated.png', 38, 38);
    this.game.load.spritesheet('spider', 'images/khersi.png', 78, 50);
    this.game.load.spritesheet('icon:key', 'images/key_icon.png', 34, 30);
    this.game.load.audio('sfx:jump', 'audio/jump.wav');
    this.game.load.audio('sfx:coin', 'audio/coin.wav');
    this.game.load.audio('sfx:stomp', 'audio/stomp.wav');
    this.game.load.audio('sfx:key', 'audio/key.wav');
    this.game.load.audio('sfx:door', 'audio/door.wav');
};
PlayState.create = function () {
    game.backgroundColor = '#454645';

    // create sound entities
    this.sfx = {
        jump: this.game.add.audio('sfx:jump'),
        coin: this.game.add.audio('sfx:coin'),
        stomp: this.game.add.audio('sfx:stomp'),
        key: this.game.add.audio('sfx:key')
    };

    this.game.add.image(0, 0, 'background');
    this._loadLevel(this.game.cache.getJSON('level:1'));
    // crete hud with scoreboards)
    this._createHud();
    this.game.world.setBounds(0, 0, 9400, 660);  // This is where you set the width you want.
    this.game.camera.follow(this.hero, Phaser.Camera.FOLLOW_PLATFORMER);


};
function up() {
    console.log('button up', arguments);
}
PlayState.update = function () {
    this._handleCollisions();
    this._handleInput();
    this.coinFont.text = `x${this.coinPickupCount}`;
    this.keyIcon.frame = this.hasKey ? 1 : 0;
    console.log(this);
};
PlayState._handleCollisions = function () {
    this.game.physics.arcade.collide(this.spiders, this.platforms);
    this.game.physics.arcade.collide(this.spiders, this.enemyWalls);
    this.game.physics.arcade.collide(this.hero, this.platforms);
    this.game.physics.arcade.overlap(this.hero, this.coins, this._onHeroVsCoin,
        null, this);
    this.game.physics.arcade.overlap(this.hero, this.spiders,
        this._onHeroVsEnemy, null, this);
    this.game.physics.arcade.overlap(this.hero, this.key, this._onHeroVsKey,
        null, this);
    this.game.physics.arcade.overlap(this.hero, this.door, this._onHeroVsDoor,
        // ignore if there is no key or the player is on air
        function (hero, door) {
            return this.hasKey && hero.body.touching.down;
        }, this);
};
PlayState._handleInput = function () {
    if (this.keys.left.isDown ) { // move hero left
        this.hero.move(-1);
    }
    else if (this.keys.right.isDown) { // move hero right
        this.hero.move(1);
    }
    else { // stop
        this.hero.move(0);
    }
};
PlayState._loadLevel = function (data) {
    // create all the groups/layers that we need
    this.bgDecoration = this.game.add.group();
    this.platforms = this.game.add.group();

    this.coins = this.game.add.group();
    this.spiders = this.game.add.group();
    this.enemyWalls = this.game.add.group();
    this.enemyWalls.visible = false;
    // spawn all platforms
    data.platforms.forEach(this._spawnPlatform, this);
    // spawn hero and enemies
    this._spawnCharacters({hero: data.hero, spiders: data.spiders});
    // spawn important objects
    data.coins.forEach(this._spawnCoin, this);
    this._spawnDoor(data.door.x, data.door.y);
    this._spawnKey(data.key.x, data.key.y);
    // enable gravity
    const GRAVITY = 1200;
    this.game.physics.arcade.gravity.y = GRAVITY;
};
PlayState._spawnPlatform = function (platform) {
    let sprite = this.platforms.create(
        platform.x, platform.y, platform.image);
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
    this._spawnEnemyWall(platform.x, platform.y, 'left');
    this._spawnEnemyWall(platform.x + sprite.width, platform.y, 'right');
};
PlayState._spawnEnemyWall = function (x, y, side) {
    let sprite = this.enemyWalls.create(x, y, 'invisible-wall');
    // anchor and y displacement
    sprite.anchor.set(side === 'left' ? 1 : 0, 1);
    // physic properties
    this.game.physics.enable(sprite);
    sprite.body.immovable = true;
    sprite.body.allowGravity = false;
};
PlayState._spawnCharacters = function (data) {
    // spawn spiders
    data.spiders.forEach(function (spider) {
        let sprite = new Spider(this.game, spider.x, spider.y);
        this.spiders.add(sprite);
    }, this);
    // spawn hero
    this.hero = new Hero(this.game, data.hero.x, data.hero.y);
    this.game.add.existing(this.hero);
};
PlayState._spawnCoin = function (coin) {
    let sprite = this.coins.create(coin.x, coin.y, 'coin');
    sprite.anchor.set(0.5, 0.5);
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.animations.add('rotate', [0, 1, 2, 1], 6, true); // 6fps, looped
    sprite.animations.play('rotate');
};
PlayState._spawnDoor = function (x, y) {
    this.door = this.bgDecoration.create(x, y, 'door');
    this.door.anchor.setTo(0.5, 1);
    this.game.physics.enable(this.door);
    this.door.body.allowGravity = false;
};
PlayState._spawnKey = function (x, y) {
    this.key = this.bgDecoration.create(x, y, 'key');
    this.key.anchor.set(0.5, 0.5);
    this.game.physics.enable(this.key);
    this.key.body.allowGravity = false;
    this.key.y -= 3;
    this.game.add.tween(this.key)
        .to({y: this.key.y + 6}, 800, Phaser.Easing.Sinusoidal.InOut)
        .yoyo(true)
        .loop()
        .start();
};
PlayState._onHeroVsCoin = function (hero, coin) {
    this.sfx.coin.play();
    coin.kill();
    this.coinPickupCount++;
};
PlayState._onHeroVsEnemy = function (hero, enemy) {
    if (hero.body.velocity.x >= 0 || hero.body.velocity.x <= 0) { // kill enemies when hero is falling
        this.coinPickupCount = this.coinPickupCount - 10;
        enemy.die();
        hero.bounce();
        this.sfx.stomp.play();
    }
    else if(doshman == false){ // game over -> restart the game
        console.log(doshman);
        this.sfx.stomp.play();
        /*this.game.state.restart();*/
        console.log(this.coinPickupCount);
    }
};
PlayState._onHeroVsKey = function (hero, key) {
    this.sfx.key.play();
    key.kill();
    this.hasKey = true;
};
PlayState._onHeroVsDoor = function (hero, door) {

    // TODO: go to the next level instead
};
PlayState._createHud = function () {
    const NUMBERS_STR = '0123456789X ';
    this.coinFont = this.game.add.retroFont('font:numbers', 20, 26,
        NUMBERS_STR);
    this.keyIcon = this.game.make.image(0, 19, 'icon:key');
    this.keyIcon.anchor.set(0, 0.5);
    let coinIcon = this.game.make.image(this.keyIcon.width + 7, 0, 'icon:coin');    let coinScoreImg = this.game.make.image(coinIcon.x + coinIcon.width,
        coinIcon.height / 2, this.coinFont);
    coinScoreImg.anchor.set(0, 0.5);
    this.hud = this.game.add.group();
    this.hud.add(coinIcon);
    this.hud.add(coinScoreImg);
    this.hud.add(this.keyIcon);
    this.hud.position.set(10, 10);
};
window.onload = function () {
    let w = window.innerWidth -50;
    let game = new Phaser.Game(w, 660, Phaser.AUTO, 'game');  // Notice the smaller width.
    game.state.add('play', PlayState);
    game.state.start('play');
};