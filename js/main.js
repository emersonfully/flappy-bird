const sprites = new Image()
sprites.src = '../assets/img/sprites.png'

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

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
    flappyBird.draw()
    
    requestAnimationFrame(loop)
}

loop()