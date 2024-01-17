const sprites = new Image()
sprites.src = '../assets/img/sprites.png'

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

// ------------ background ------------

const background = {
    spriteX: 390, 
    spriteY: 0,
    width: 275,
    height: 204,
    positionX: 0,
    positionY: canvas.height - 204,
    draw() {
        context.fillStyle = '#70c5ce'
        context.fillRect(0,0, canvas.width, canvas.height)

        context.drawImage(
            sprites,
            background.spriteX, background.spriteY,
            background.width, background.height,
            background.positionX, background.positionY,
            background.width, background.height
        ) 
        context.drawImage(
            sprites,
            background.spriteX, background.spriteY,
            background.width, background.height,
            (background.positionX + background.width), background.positionY,
            background.width, background.height
        ) 
    }
}

// ------------ ground ------------

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

// ------------ the bird ------------

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
    background.draw()
    ground.draw()
    flappyBird.draw()
    
    requestAnimationFrame(loop)
}

loop()