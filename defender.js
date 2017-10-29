var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

function preload () {

    game.load.image('specialForces', 'assets/sprites/ufo.png');
    game.load.image('newPlayer', 'assets/sprites/player.png');
    game.load.image('star', 'assets/demoscene/star2.png');
    game.load.image('baddie', 'assets/sprites/space-baddie.png');
    game.load.image('fuelTank', 'assets/sprites/orb-red.png');
    game.load.atlas('lazer', 'assets/games/defender/laser.png', 'assets/games/defender/laser.json');
    game.load.spritesheet('kaboom', 'assets/games/invaders/explode.png', 128, 128);
    game.load.bitmapFont('stack', 'assets/demoscene/shortStack.png', 'assets/demoscene/shortStack.xml');
    game.load.image('bullet', 'assets/games/defender/bullet170.png');
    game.load.image('platform', 'assets/sprites/platform.png');
    game.load.image('guard', 'assets/sprites/shmup-ship.png');
}

var stars;
var baddies;
var lazers;
var player;
var cursors;
var fireButton;
var bulletTime = 0;
var frames;
var prevCamX = 0;
var score = 0;
var fuelAmount = 200;
var explosion = [];
var hasBeenCalled = false;
var ammunition = 200;
var fuelTanks;
var ammunitionGraphics;
var fuelGraphics;
var bmpText;
var platform;

//var collideTrueFalse = false;

class ChaserBaddie {
    constructor(game, x, y, name){
        this.baddie = game.add.sprite(x, y, 'baddie');
        game.physics.arcade.enable(this.baddie);
        this.name = name;
        this.collideTrueFalse = false;
    }

    setChaseAfter(sprite){
        this._chaseAfter = sprite;
    }

    startUpdating(){
        var self = this;
        setInterval(function(){
            self.update();
        }, 20);
    }

    setOtherBaddie(otherBaddie){
        this.someOtherBaddie = otherBaddie;
    }

    update(){
        var self = this;
        game.physics.arcade.collide(this.someOtherBaddie, this.baddie, function() {
            self.collideTrueFalse = true;
            setTimeout(function() {
                self.collideTrueFalse = false;
            }, 1000);
        });

        var player = this._chaseAfter;
        var baddie = this.baddie;
        var xdiff = player.x - baddie.x;

        var ydiff = player.y - baddie.y;
        if(self.collideTrueFalse == false) {
            if (xdiff > 0) {
                baddie.body.velocity.x = 100;
                //baddie.scale.x = 1;
            } else if (xdiff < 0) {
                baddie.body.velocity.x = -100;
                //player.scale.x = -1;
            } else {
                baddie.body.velocity.x = 0;
            }

            if (ydiff > 0) {
                baddie.body.velocity.y = 100;
                //baddie.scale.x = 1;
            } else if (ydiff < 0) {
                baddie.body.velocity.y = -100;
                //baddie.scale.x = -1;
            } else {
                baddie.body.velocity.y = 0;
            }
        }

        game.physics.arcade.overlap(lazers, this.baddie, function(lazers, theBaddie) {
            self.baddie.kill();
            console.log("you killed a chaser");
        });
    }
}

function create () {


    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, 800*4, 600);

    frames = Phaser.Animation.generateFrameNames('frame', 2, 30, '', 2);
    frames.unshift('frame02');

    stars = game.add.group();

    for (let i = 0; i < 128; i++) {
        stars.create(game.world.randomX, game.world.randomY, 'star');
    }


    platform = game.add.sprite(100, 330, 'platform');
    platform.scale.setTo(0.5, 0.5);
    game.physics.arcade.enable(platform);
    platform.body.immovable = true;

    baddies = game.add.group();
    baddies.enableBody = true;
    baddies.physicsBodyType = Phaser.Physics.ARCADE;

    for (let i = 0; i < 16; i++) {
       //baddies.create(game.world.randomX, game.world.randomY, 'baddie');
    }

    lazers = game.add.group();
    lazers.enableBody = true;
    lazers.physicsBodyType = Phaser.Physics.ARCADE;

    fuelTanks = game.add.group();
    fuelTanks.enableBody = true;
    fuelTanks.physicsBodyType = Phaser.Physics.ARCADE;
    fuelTanks.collideWorldBounds = true;

    for (let i = 0; i < 5; i++) {
        fuelTanks.create(game.world.randomX, game.world.randomY, 'fuelTank');
    }

    player = game.add.sprite(100, 300, 'newPlayer');
    game.physics.arcade.enable(player);
    player.anchor.x = 0.5;
    player.body.collideWorldBounds = true;
    player.body.bounce.y = 0.2;
    player.body.bounce.x = 0.2;
    player.body.gravity.y = 100;
    player.scale.setTo(1.5, 1.8);
    player.animations.add('kaboom');

    for(let i = 0; i < 5; i++) {
        explosion[i] = game.add.sprite(-100,-100, 'kaboom');
        explosion[i].animations.add('explode');
    }

    var chaserBaddie = new ChaserBaddie(game, 400, 200,  "bob");
    var chaserBaddie1 = new ChaserBaddie(game, 400, 200, "james");
    var chaserBaddie2 = new ChaserBaddie(game, 800, 400, "bill");
    var chaserBaddie3 = new ChaserBaddie(game, 700, 100, "bonnie");
    var chaserBaddie4 = new ChaserBaddie(game, 300, 400, "daniel");
    var chaserBaddie5 = new ChaserBaddie(game, 900, 200, "oscar");
    var chaserBaddie6 = new ChaserBaddie(game, 600, 200, "dave");

    chaserBaddie.setChaseAfter(player);
    chaserBaddie1.setChaseAfter(player);
    chaserBaddie2.setChaseAfter(player);
    chaserBaddie3.setChaseAfter(player);
    chaserBaddie4.setChaseAfter(player);
    chaserBaddie5.setChaseAfter(player);
    chaserBaddie6.setChaseAfter(player);

    chaserBaddie.setOtherBaddie(chaserBaddie1.baddie);

    //For debugging purposes only
    window.chaserBaddie = chaserBaddie;

    chaserBaddie.startUpdating();
    chaserBaddie1.startUpdating();
    chaserBaddie2.startUpdating();
    chaserBaddie3.startUpdating();
    chaserBaddie4.startUpdating();
    chaserBaddie5.startUpdating();
    chaserBaddie6.startUpdating();



    game.add.sprite(200, 200, 'specialForces');
    game.add.sprite(375, 400, 'guard');


    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1);

    //bmpText.fixedToCamera = true;

    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    prevCamX = game.camera.x;

        //var textFuel = game.add.bitmapText(900, 100, 'stack', 'Fuel', 64);

        //game.physics.arcade.enable([textFuel]);

        //textFuel = game.add.bitmapText(700, 100, 'stack', 'Phaser & Pixi\nrocking!', 64);
    //bmpText = game.add.bitmapText(70, 50, 'stack', 'fuel', 30);

    ammunitionGraphics = game.add.graphics(100, 100);
    ammunitionGraphics.fixedToCamera = true;
    fuelGraphics = game.add.graphics(100, 100);
    fuelGraphics.fixedToCamera = true;

    var textFuel = game.add.text(50, 26, "Fuel", { font: "25px Arial", fill: "#800000", align: "center" });
    textFuel.fixedToCamera = true;
    var textAmmunition = game.add.text(430, 26, 'Ammunition', { font: '25px Arial', fill: '#800000', align: "center"});
    textAmmunition.fixedToCamera = true;
}

function playExplosion(delay, explosion, player){

    setTimeout(function() {
        explosion.reset(player.x -  ((0.5 - Math.random()) * 200), player.y - ((0.5 - Math.random()) * 200));
        explosion.animations.play('explode', 30, false, true);
    }, delay);
}

function update () {

    game.physics.arcade.overlap(lazers, baddies, function(lazer,baddie){
        baddie.kill();
        score++

    }, null, this);

    game.physics.arcade.overlap(player, baddies, function(player, baddie){

    }, null, this);

    game.physics.arcade.overlap(player, fuelTanks, function(player, fuelTank) {
        if (fuelAmount > 149) {
            fuelTank.kill();
            fuelAmount = fuelAmount + (200-fuelAmount)
        } else if (fuelAmount <= 149) {
            fuelTank.kill();
            fuelAmount = fuelAmount + 50;
        }
    });

    game.physics.arcade.overlap(lazers, fuelTanks, function(lazers, fuelTank) {
        fuelTank.kill();
    });

    game.physics.arcade.collide(player, platform, function() {
        if(fuelAmount < 200) {
            fuelAmount = fuelAmount + 0.5;
        }
        if(ammunition < 200) {
            ammunition = ammunition + 0.5;
        } else {
            ammunition = ammunition + 0;
        }
    });



    drawFuel(fuelAmount);

    if(fuelAmount <= 0 && hasBeenCalled == false) {
        for(let i = 0; i < 5; i++) {
            playExplosion(Math.random() * 600, explosion[i], player);
        }
        player.kill();
        hasBeenCalled = true
    }

    if(fuelAmount > 0) {
        if(cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown ) {
            fuelAmount = fuelAmount - 0.5
        }
        if(cursors.left.isDown)
        {
            player.body.velocity.x = player.body.velocity.x - 10;
            player.scale.x = -1;
        }
        else if(cursors.right.isDown)
        {
            player.body.velocity.x = player.body.velocity.x + 10;
            player.scale.x = 1;
        }

        if(cursors.up.isDown)
        {
            //player.y -= 8;
            player.body.velocity.y = player.body.velocity.y - 10;
        }
        else if(cursors.down.isDown)
        {
            player.body.velocity.y = player.body.velocity.y + 10;
        }
        if(ammunition > 0) {
            drawAmmunition(ammunition);
            if(fireButton.isDown)
            {
                fireBullet();
                ammunition = ammunition - 1;
                var playerVelocity = player.body.velocity;
                var playerAcceleration = player.body.acceleration;
                if (player.scale.x === 1) {
                    playerVelocity.x = playerVelocity.x -5;
                } else if (player.scale.x === -1) {
                    playerVelocity.x = playerVelocity.x + 5;
                }
            }
        }
    }





    lazers.forEachAlive(updateBullets, this);

    prevCamX = game.camera.x;

}

function drawAmmunition(ammunition) {


    ammunitionGraphics.beginFill(0xFFFFFF);

    ammunitionGraphics.clear();
    ammunitionGraphics.endFill();
    ammunitionGraphics.lineStyle(2, 0x0000FF, 1);
    ammunitionGraphics.drawRect( 300, -70, 200, 20);
    ammunitionGraphics.beginFill(0xFFFFFF);
    ammunitionGraphics.drawRect( 300, -70, ammunition, 20);
}

function drawFuel(fuelAmount) {


    fuelGraphics.beginFill(255, 255, 255);

    fuelGraphics.clear();
    fuelGraphics.endFill();
    fuelGraphics.lineStyle(2, 0x0000FF, 1);
    fuelGraphics.drawRect( -70, -70, 200, 20);
    fuelGraphics.beginFill(0xFFFFFF);
    fuelGraphics.drawRect( -70, -70, fuelAmount, 20);
}

function updateBullets (lazer) {

    // if (game.time.now > frameTime)
    // {
    //     frameTime = game.time.now + 500;
    // }
    // else
    // {
    //     return;
    // }

    //  Adjust for camera scrolling
    var camDelta = game.camera.x - prevCamX;
    lazer.x += camDelta;

    if (lazer.animations.frameName !== 'frame30')
    {
        lazer.animations.next();
    }
    else
    {
        if (lazer.scale.x === 1)
        {
            lazer.x += 16;

            if (lazer.x > (game.camera.view.right - 224))
            {
                lazer.kill();
            }
        }
        else
        {
            lazer.x -= 16;

            if (lazer.x < (game.camera.view.left - 224))
            {
                lazer.kill();
            }
        }
    }

}

function fireBullet () {

    if (game.time.now > bulletTime)
    {
        //  Grab the first bullet we can from the pool
        lazer = lazers.getFirstDead(true, player.x + 24 * player.scale.x, player.y + 8, 'lazer');

        lazer.animations.add('fire', frames, 60);
        lazer.animations.frameName = 'frame02';

        lazer.scale.x = player.scale.x;

        if (lazer.scale.x === 1)
        {
             //lazer.anchor.x = 1;
        }
        else
        {
             //lazer.anchor.x = 0;
        }

        //  Lazers start out with a width of 96 and expand over time
         //lazer.crop(new Phaser.Rectangle(244-96, 0, 96, 2), true);

        bulletTime = game.time.now + 250;
    }

}
