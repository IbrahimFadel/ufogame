var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

function preload () {

    game.load.image('player', 'assets/games/defender/ship.png');
    game.load.image('newPlayer', 'assets/sprites/ufo.png');
    game.load.image('star', 'assets/demoscene/star2.png');
    game.load.image('baddie', 'assets/sprites/space-baddie.png');
    game.load.image('fuelTank', 'assets/sprites/orb-red.png');
    game.load.atlas('lazer', 'assets/games/defender/laser.png', 'assets/games/defender/laser.json');
    game.load.spritesheet('kaboom', 'assets/games/invaders/explode.png', 128, 128);
    game.load.bitmapFont('stack', 'assets/demoscene/shortStack.png', 'assets/fonts/bitmapFonts/shortStack.xml');
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
var explosion;
var hasBeenCalled = false;
var ammunition = 200;
var textFuel;
var textAmmunition;

    function create () {


    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, 800*4, 600);

    frames = Phaser.Animation.generateFrameNames('frame', 2, 30, '', 2);
    frames.unshift('frame02');

    stars = game.add.group();

    for (let i = 0; i < 128; i++)
    {
        stars.create(game.world.randomX, game.world.randomY, 'star');
    }

    baddies = game.add.group();
    baddies.enableBody = true;
    baddies.physicsBodyType = Phaser.Physics.ARCADE;

    for (let i = 0; i < 16; i++)
    {
        baddies.create(game.world.randomX, game.world.randomY, 'baddie');
    }

    lazers = game.add.group();
    lazers.enableBody = true;
    lazers.physicsBodyType = Phaser.Physics.ARCADE;

    fuelTank = game.add.sprite(200, 200, 'fuelTank');
    game.physics.arcade.enable(fuelTank);
    fuelTank.anchor.x = 0.5;
    fuelTank.collideWorldBounds = true;

    for (let i = 0; i < 5; i++)
    {
        baddies.create(game.world.randomX, game.world.randomY, 'fuelTank');
    }

    player = game.add.sprite(100, 300, 'newPlayer');
    game.physics.arcade.enable(player);
    player.anchor.x = 0.5;
    player.body.collideWorldBounds = true;
    player.body.gravity.y = 100;

    player.animations.add('kaboom');
    explosion = game.add.sprite(-100,-100, 'kaboom');
    explosion.animations.add('explode');

    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1);

    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    prevCamX = game.camera.x;

        var textFuel = game.add.bitmapText(100, 100, 'stack', 'Fuel', 64);
    }

function update () {
    game.physics.arcade.overlap(lazers, baddies, function(lazer,baddie){
        baddie.kill();
        score++

    }, null, this);

    game.physics.arcade.overlap(player, baddies, function(player, baddie){

    }, null, this);

    game.physics.arcade.overlap(player, fuelTank, function(player, fuel) {
        if (fuelAmount > 149) {
            fuelTank.kill();
            fuelAmount = fuelAmount + (200-fuelAmount)
        } else if (fuelAmount <= 149) {
            fuelTank.kill();
            fuelAmount = fuelAmount + 50;
        }
    })

    var graphics = game.add.graphics(100, 100);
    graphics.fixedToCamera = true;
    graphics.beginFill(255, 255, 255);


    graphics.clear();
    graphics.endFill();
    graphics.lineStyle(2, 0x0000FF, 1);
    graphics.drawRect( -70, -70, 200, 20);
    graphics.beginFill(0xFFFFFF);
    graphics.drawRect( -70, -70, fuelAmount, 20);


    if(fuelAmount <= 0 && hasBeenCalled == false) {
        explosion.reset(player.x - 70, player.y - 50);
        explosion.animations.play('explode', 30, false, true);
        player.kill();
        hasBeenCalled = true
    }

    if(fuelAmount > 0) {
        if(cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown ) {
            fuelAmount = fuelAmount - 0.1
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
        if(ammunition <= 0) {
            ammunition = 0;
        } else if(ammunition > 0) {
            var graphics = game.add.graphics(100, 100);
            graphics.fixedToCamera = true;
            graphics.beginFill(0xFFFFFF);





            graphics.clear();
            graphics.endFill();
            graphics.lineStyle(2, 0x0000FF, 1);
            graphics.drawRect( 300, -70, 200, 20);
            graphics.beginFill(0xFFFFFF);
            graphics.drawRect( 300, -70, ammunition, 20);

            if(fireButton.isDown)
            {
                fireBullet();
                ammunition = ammunition - 1;
                if (player.scale.x === 1) {
                    player.body.velocity.x = player.body.velocity.x - 5;
                } else if (player.scale.x === -1) {
                    player.body.velocity.x = player.body.velocity.x + 5;
                }
            }
        }
    }





    lazers.forEachAlive(updateBullets, this);

    prevCamX = game.camera.x;

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
            // lazer.anchor.x = 1;
        }
        else
        {
            // lazer.anchor.x = 0;
        }

        //  Lazers start out with a width of 96 and expand over time
        // lazer.crop(new Phaser.Rectangle(244-96, 0, 96, 2), true);

        bulletTime = game.time.now + 250;
    }

}
