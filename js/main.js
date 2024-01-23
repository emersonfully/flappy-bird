const sprites = new Image()
sprites.src = '../assets/img/sprites.png'
// const hitSound = new Audio()
// hitSound.src = '../assets/sounds/hit.wav'
// const jumpSound = new Audio()
// jumpSound.src = '../assets/sounds/jump.wav'
// const pointSound = new Audio()
// pointSound.src = '../assets/sounds/point.wav'

let frames = 0
const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

const isImageLoaded = () => sprites.complete && sprites.naturalWidth !== 0

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


        if( isImageLoaded()) {

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
            if(isImageLoaded()) {

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
        if(isImageLoaded()) {

            context.drawImage(
                sprites,
                msgReady.spriteX, msgReady.spriteY,
                msgReady.width, msgReady.height,
                msgReady.positionX, msgReady.positionY,
                msgReady.width, msgReady.height
            )
        }
    }
}

// ------------ game over screen ------------

const msgGameOver = {
    spriteX: 134,
    spriteY: 153,
    width: 226,
    height: 200,
    positionX: (canvas.width / 2) - 226 / 2,
    positionY: 50,
    draw() {
        if(isImageLoaded()) {

            context.drawImage(
                sprites,
                msgGameOver.spriteX, msgGameOver.spriteY,
                msgGameOver.width, msgGameOver.height,
                msgGameOver.positionX, msgGameOver.positionY,
                msgGameOver.width, msgGameOver.height
            )
        }
    }
}

// ------------ pipes ------------

function createPipes() {
    const pipes = {
        width: 52,
        height: 400,
        ground: {
            spriteX: 0,
            spriteY: 169
        },
        sky: {
            spriteX: 52,
            spriteY: 169,
        },
        space: 80,
        draw() {

            if(isImageLoaded()) {

                pipes.pares.forEach(function(par) {

                    const randomY = par.y
                    const spaceBetweenPipes = 90

                    const skyPipeX = par.x
                    const skyPipeY = randomY


                
                // sky pipes
                    context.drawImage(
                        sprites,
                        pipes.sky.spriteX, pipes.sky.spriteY,
                        pipes.width, pipes.height,
                        skyPipeX, skyPipeY,
                        pipes.width, pipes.height
                    )
                
                    //ground pipes
                    const groundPipeX = par.x
                    const groundPipeY = pipes.height + spaceBetweenPipes + randomY

                    context.drawImage(
                        sprites,
                        pipes.ground.spriteX, pipes.ground.spriteY,
                        pipes.width, pipes.height,
                        groundPipeX, groundPipeY,
                        pipes.width, pipes.height
                    )

                    par.skyPipe = {
                        x: skyPipeX,
                        y: pipes.height + skyPipeY
                    }

                    par.groundPipe ={
                        x: groundPipeX,
                        y: groundPipeY
                    }
                })
            }
        },
        hasCollisionWithBird(par) {
            const birdHead = globals.flappyBird.positionY
            const birdFeet = globals.flappyBird.positionY + globals.flappyBird.height
            if((globals.flappyBird.spriteX + globals.flappyBird.width) >= par.x) {
                // console.log('Flappy bird invadiu a area')
                // pointSound.play()

                if(birdHead <= par.skyPipe.y) {
                    // hitSound.play()
                    return true
                }

                if(birdFeet >= par.groundPipe.y) {
                    // hitSound.play()
                    return true
                }
            }

            return false
        },
        pares: [],
        refresh() {
            const  after100Frames = frames % 100 === 0
            if(after100Frames) {
                console.log('passou 100 frames')
                pipes.pares.push({
                    x: canvas.width,
                    y: -150 * (Math.random() + 1)
                })
            }

            pipes.pares.forEach(function(par) {
                par.x = par.x - 2

                if(pipes.hasCollisionWithBird(par)) {
                    changeScreen(screens.gameOver)
                }

                if(par.x + pipes.width <= 0) {
                    pipes.pares.shift()
                }
            })
        }
    }

    return pipes
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
            // jumpSound.play()
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
                // hitSound.play()

                changeScreen(screens.gameOver)
                return
            }
            flappyBird.speed = flappyBird.speed + flappyBird.gravity
            flappyBird.positionY = flappyBird.positionY + flappyBird.speed
        },
        draw() {
            if(isImageLoaded()) {
                flappyBird.actualFrameRefresh()
                const {spriteX, spriteY} = flappyBird.moves[flappyBird.actualFrame]
                context.drawImage(
                    sprites, // the sprite image
                    spriteX, spriteY, // Sprite x, Sprite y
                    flappyBird.width, flappyBird.height, // sprite size
                    flappyBird.positionX, flappyBird.positionY, // draw location inside canvas
                    flappyBird.width, flappyBird.height // sprite size inside canvas
                )

            }
    
        }
    }

    return flappyBird
}

function createScore() {
    const score = {
        points: 0,
        refresh() {
            const frameInterval = 100
            const beyondInterval = frames % frameInterval === 0

            if(beyondInterval) {
                score.points = score.points + 1

            }
        },
        draw() {
            if(isImageLoaded()) {

                context.font = '35px VT323'
                context.textAlign = 'right'
                context.fillStyle = 'white'
                context.fillText(`${score.points}`, canvas.width - 10, 35)
            }
        }
    }

    return score
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
            globals.pipes = createPipes()
        },
        draw() {
            background.draw()
            if(isImageLoaded()) {

                globals.flappyBird.draw()
                
                globals.ground.draw()
                msgReady.draw()
            }

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
    initialize() {
        globals.score = createScore()
    },
    draw() {
        if(isImageLoaded()) {
            
            background.draw()
            globals.flappyBird.draw()
            globals.pipes.draw()
            globals.ground.draw()
            globals.score.draw()
        }
    },
    click() {
        globals.flappyBird.jump()
    },
    refresh() {
        globals.flappyBird.refresh()
        globals.ground.refresh()
        globals.pipes.refresh()
        globals.score.refresh()
    }
}

screens.gameOver = {
    draw() {
        if(isImageLoaded()) {

            msgGameOver.draw()
        }
    },
    refresh() {

    },
    click() {
        changeScreen(screens.start)
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