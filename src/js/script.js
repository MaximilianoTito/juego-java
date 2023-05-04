var gameSettings = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics:
    {
        default: 'arcade',
        arcade:
        {
            gravity:
            {
                y: 300,
            },
            debug: false
        },
    },
    scene:
    {
        preload: preload,
        create: create,
        update: update
    }
};
var score = 0;
var scoreText;
var gameOver = false;
var game = new Phaser.Game(gameSettings);

function preload() {
    this.load.image("sceneBackground", "../src/assets/sceneBackground.png");
    this.load.image('floor', '../src/assets/floor.png');
    this.load.image('star', '../src/assets/star.png');
    this.load.spritesheet('emex', '../src/assets/emex.png',
        {
            frameWidth: 32,
            frameHeight: 48
        }
    );
    this.load.image('enemix', '../src/assets/enemix.png')
}

function create() {

    //SCENE
    this.add.image(400, 300, "sceneBackground");

    //SURFACE
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 570, 'floor').setScale(2).refreshBody();
    platforms.create(540, 380, 'floor');
    platforms.create(750, 300, 'floor');
    platforms.create(25, 440, 'floor');
    platforms.create(400, 200, 'floor');
    platforms.create(100, 100, 'floor');
    //platforms.create(600, 90, 'floor');

    //PERSONAJES
    actress = this.physics.add.sprite(100, 100, 'emex');
    actress.setCollideWorldBounds(true);
    actress.setBounce(0.2);

    //KEYBOARD CONTROLLER
    this.anims.create(
        {
            key: 'left',
            frames: this.anims.generateFrameNumbers('emex',
                {
                    start: 0,
                    end: 3
                }
            ),
            frameRate: 8,
            repeat: -1,

        }
    );

    this.anims.create(
        {
            key: 'right',
            frames: this.anims.generateFrameNumbers('emex',
                {
                    start: 5,
                    end: 7
                }
            ),
            frameRate: 5,
            repeat: -1
        }
    );

    this.anims.create(
        {
            key: 'still',
            frames: [
                {
                    key: 'emex',
                    frame: 4
                }
            ],
            frameRate: 20
        }
    );

    //actress.body.setGravityY(3000);

    //COLLIDERS

    this.physics.add.collider(actress, platforms);

    cursors = this.input.keyboard.createCursorKeys();

    stars = this.physics.add.group(
        {
            key: 'star',
            repeat: 11,
            setXY: {
                X: 10,
                Y: 0,
                stepX: 70
            }
        }
    )

    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    })

    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(stars, actress, collectStar, null, true);

    scoreText = this.add.text(16, 16, 'score: 0',
        {
            fontSize: '22px',
            fill: '#ff0534'
        }
    )

    booms = this.physics.add.group();
    this.physics.add.collider(booms, platforms);
    this.physics.add.collider(actress, booms, hitBoom, null, this);


}

function update() {

    if (gameOver) {
        console.log('stop')
        return;
    }

    if (cursors.left.isDown) {
        actress.setVelocityX(-160);
        actress.anims.play('left', true)
    } else if (cursors.right.isDown) {
        actress.setVelocityX(160);
        actress.anims.play('right', true);
    } else {
        actress.setVelocityX(0);
        actress.anims.play('still');
    }

    if (cursors.up.isDown && actress.body.touching.down) {
        actress.setVelocityY(-270);
    }
}

function collectStar(actress, star) {
    star.disableBody(true, true);
    score += 10;
    scoreText.setText('Score:' + score);

    if (stars.countActive(true) === 0) {
        stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });
        var x = (actress.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        var boom = booms.create(x, 16, 'boomb');
        boom.setBounce(1);
        boom.setCollideWorldBounds(true);
        boom.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }



}

function hitBoom(actress, boom) {
    this.physics.pause();
    actress.setTint(0xff0303);
    actress.anims.play('still');
    gameOver: true;
}

