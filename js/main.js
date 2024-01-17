const sprites = new Image()
sprites.src = '../assets/img/sprites.png'

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

// ground

const ground = {
    spriteX: 0,
    spriteY: 610,
    width: 224,
    height: 112,
    positionX: 0,
    positionY: canvas.height - 112,
    draw() {
        context.drawImage(
            sprites,
            ground.spriteX, ground.spriteY,
            ground.width, ground.height,
            ground.positionX, ground.positionY,
            ground.width, ground.height
        )

        context.drawImage(
            sprites,
            ground.spriteX, ground.spriteY,
            ground.width, ground.height,
            (ground.positionX + ground.width), ground.positionY,
            ground.width, ground.height
        )
    }
}

const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    width: 33,
    height: 24,
    positionX: 10,
    positionY: 50,
    draw() {
        context.drawImage(
        sprites, // the psrite image
        flappyBird.spriteX, flappyBird.spriteY, // Sprite x, Sprite y
        flappyBird.width, flappyBird.height, // sprite size
        flappyBird.positionX, flappyBird.positionY, // draw location inside canvas
        flappyBird.width, flappyBird.height // sprite size inside canvas
        )

    }
}

function loop() {
    ground.draw()
    flappyBird.draw()
    
    requestAnimationFrame(loop)
}

loop()