const sprites = new Image()
sprites.src = '../assets/img/sprites.png'
const hitSound = new Audio()
hitSound.src = '../assets/sounds/hit.wav'

let frames = 0
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

// ------------ collision ------------

function collision(flappyBird, ground) {
    const flappyBirdY = flappyBird.positionY + flappyBird.height
    const groundY = ground.positionY 

    if(flappyBirdY >= groundY) {
        return true
    }

    return false
}

// ------------ ground ------------

function createGround() {
    const ground = {
        spriteX: 0,
        spriteY: 610,
        width: 224,
        height: 112,
        positionX: 0,
        positionY: canvas.height - 112,
        refresh() {
            const groundMovement = 1
            const repeatIn = ground.width / 2
            const movement = ground.positionX - groundMovement

            ground.positionX = movement % repeatIn
        },
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

    return ground
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

function createFlappyBird() {

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
        moves: [
            {spriteX: 0, spriteY: 0,},
            {spriteX: 0, spriteY: 26,},
            {spriteX: 0, spriteY: 52,},
            {spriteX: 0, spriteY: 26,},
        ],
        actualFrame: 0,
        actualFrameRefresh() {
            const frameInterval = 10
            const beyondInterval = frames % frameInterval === 0
            if(beyondInterval) {

                const incrementBase = 1
                const increment = incrementBase + flappyBird.actualFrame
                const repeatBase = flappyBird.moves.length
                
                flappyBird.actualFrame = increment % repeatBase
            }
        },
        refresh() {
            if(collision(flappyBird, globals.ground)) {
                console.log('collided')
                hitSound.play()

                setTimeout(() => {
                    changeScreen(screens.start)
                }, 500);
                return
            }
            flappyBird.speed = flappyBird.speed + flappyBird.gravity
            flappyBird.positionY = flappyBird.positionY + flappyBird.speed
        },
        draw() {
            flappyBird.actualFrameRefresh()
            const {spriteX, spriteY} = flappyBird.moves[flappyBird.actualFrame]
            context.drawImage(
                sprites, // the psrite image
                spriteX, spriteY, // Sprite x, Sprite y
                flappyBird.width, flappyBird.height, // sprite size
                flappyBird.positionX, flappyBird.positionY, // draw location inside canvas
                flappyBird.width, flappyBird.height // sprite size inside canvas
            )
    
        }
    }

    return flappyBird
}


// ------------ screens ------------

const globals = {}
let activeScreen = {}

function changeScreen(newScreen) {
    activeScreen = newScreen

    if(activeScreen.initialize) {
        activeScreen.initialize()
    }
}

const screens = {
    start: {
        initialize() {
            globals.flappyBird = createFlappyBird()
            globals.ground = createGround()
        },
        draw() {
            background.draw()
            globals.ground.draw()
            globals.flappyBird.draw()
            msgReady.draw()

        },
        click() {
            changeScreen(screens.game)
        },
        refresh() {
            globals.ground.refresh()
        }
    }
}

screens.game = {
    draw() {
        background.draw()
        globals.ground.draw()
        globals.flappyBird.draw()
    },
    click() {
        globals.flappyBird.jump()
    },
    refresh() {
        globals.flappyBird.refresh()

    }
}

function loop() {
    activeScreen.draw()
    activeScreen.refresh()
    frames = frames + 1

    requestAnimationFrame(loop)
}

window.addEventListener('click', function() {
    if(activeScreen.click) {
        activeScreen.click()
    }
})

changeScreen(screens.start)
loop()