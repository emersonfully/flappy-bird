const sprites = new Image()
sprites.src = '../assets/img/sprites.png'

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

function loop() {
    context.drawImage(
    sprites, // the psrite image
    0, 0, // Sprite x, Sprite y
    33, 24, // sprite size
    10, 50, // draw location inside canvas
    33, 24 // sprite size inside canvas
    )

    
    requestAnimationFrame(loop)
}

loop()