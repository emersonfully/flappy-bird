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

// ------------ start screen ------------

const msgReady = {
    spriteX: 134,
    spriteY: 0,
    width: 174,
    height: 152,
    positionX: (canvas.width / 2) - 174 / 2,
    positionY: 50,
    draw() {
        context.drawImage(
            sprites,
            msgReady.spriteX, msgReady.spriteY,
            msgReady.width, msgReady.height,
            msgReady.positionX, msgReady.positionY,
            msgReady.width, msgReady.height
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
    gravity: 0.25,
    speed: 0,
    jumpHeight: 4.6,
    jump() {
        flappyBird.speed = - flappyBird.jumpHeight
    },

    refresh() {
        flappyBird.speed = flappyBird.speed + flappyBird.gravity
        flappyBird.positionY = flappyBird.positionY + flappyBird.speed
    },
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

// ------------ screens ------------

let activeScreen = {}

function changeScreen(newScreen) {
    activeScreen = newScreen
}

const screens = {
    start: {
        draw() {
            background.draw()
            ground.draw()
            flappyBird.draw()
            msgReady.draw()

        },
        click() {
            changeScreen(screens.game)
        },
        refresh() {

        }
    }
}

screens.game = {
    draw() {
        background.draw()
        ground.draw()
        flappyBird.draw()
    },
    click() {
        flappyBird.jump()
    },
    refresh() {
        flappyBird.refresh()

    }
}

function loop() {
    activeScreen.draw()
    activeScreen.refresh()
    
    requestAnimationFrame(loop)
}

window.addEventListener('click', function() {
    if(activeScreen.click) {
        activeScreen.click()
    }
})

changeScreen(screens.start)
loop()