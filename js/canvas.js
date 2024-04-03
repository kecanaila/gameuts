class Canvas {
    constructor() {
        this.canvas = document.getElementById("game-canvas")
        this.ctx = this.canvas.getContext("2d")
    }

    paint(matrix) {
        this.ctx.clearRect(0, 0, 300, 540)

        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 5;
        this.ctx.strokeRect(0, 0, 300, 540);

        let x = 0
        let y = 0

        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                if (matrix[i][j].value) {
                    x = j * 30
                    y = (i - 2) * 30 // -1 because there is an extra row on top, used to avoid crashes when rotations at the top

                    this.ctx.fillStyle = matrix[i][j].color
                    this.ctx.strokeStyle = "black"
                    this.ctx.lineWidth = 3
                    this.ctx.fillRect(x, y, 30, 30)
                    this.ctx.strokeRect(x, y, 30, 30)
                }
            }
        }
    }

    paintWon() {
        this.ctx.textBaseLine = "middle"
        this.ctx.textAlign = "center"
        this.ctx.fillStyle = "white"
        this.ctx.font = `50px Overpass Mono`
        this.ctx.fillText("YOU WON", this.canvas.width / 2, this.canvas.height / 2)
    }

    paintLost() {
        this.ctx.textBaseLine = "middle"
        this.ctx.textAlign = "center"
        this.ctx.fillStyle = "white"
        this.ctx.font = `50px Overpass Mono`
        this.ctx.fillText("YOU LOST", this.canvas.width / 2, this.canvas.height / 2)
    }
}
