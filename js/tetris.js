const pieceTypes = [
    "forwardL",
    "backwardL",
    "cube",
    "cross",
    "forwardS",
    "backwardS",
    "line",
]


const lostSound = document.getElementById("lost-sound")
const collisionSound = document.getElementById("collision-sound")
const fullLineSound = document.getElementById("full-line-sound")
const startSound = document.getElementById("start-sound")
const rotateSound = document.getElementById("rotate-sound")
const wonSound = document.getElementById("won-sound")

class Tetris {
    constructor() {
        this.timer = 0
        this.lines = 0
        this.score = 0
        this.lineGoal = 15
        this.currentPiece = null
        this.matrix = null
        this.gameInterval = null
        this.gameOn = false
    }

    getMatrix() {
        return this.matrix
    }

    getLines() {
        return this.lines
    }

    getScore() {
        return this.score
    }

    start() {
        startSound.play()
        this.timer = 0
        this.lines = 0
        this.score = 0
        this.currentPiece = this.generateNewPiece(this.generatePieceType())
        this.nextPiece = this.generatePieceType()
        this.matrix = this.buildEmptyArray()
        this.hasWonOrLost = false
        if (this.gameInterval) clearInterval(this.gameInterval)
        this.gameInterval = setInterval(() => {
            this.timer += 0.5
            this.moveCurrentPieceDown()
        }, 500)
    }

    stop() {
        clearInterval(this.gameInterval)
    }

    continue() {
        this.gameInterval = setInterval(() => {
            this.timer += 0.5
            this.moveCurrentPieceDown()
        }, 500)
    }

    updatePiece(callback) {
        if (this.currentPiece.previousIndexes) {
            this.cleanPreviousLoc()
        }
        let newOrientation = this.currentPiece.getOrientation()
        let centerX = this.currentPiece.getCenterPieceLoc().x
        let centerY = this.currentPiece.getCenterPieceLoc().y
        this.matrix[centerX][centerY] = {
            value: true,
            color: this.currentPiece.color,
        }

        for (const sq of newOrientation) {
            this.matrix[centerX + sq.x][centerY + sq.y] = {
                value: true,
                color: this.currentPiece.color,
            }
        }

        if (callback) callback()
    }

    setCurrentPiece(piece) {
        this.currentPiece = piece
    }

    buildEmptyArray() {
        let newMatrix = []

        //There are 18 rows, but we add two extra one on top to avoid crashes
        for (let i = 0; i < 20; i++) {
            let newArr = []
            for (let j = 0; j < 10; j++) {
                newArr.push({
                    value: false,
                    color: null,
                })
            }
            newMatrix.push(newArr)
        }

        return newMatrix
    }

    printMatrix() {
        const vals = []

        for (let i = 2; i < 20; i++) {
            let newArr = []
            for (let j = 0; j < 10; j++) {
                newArr.push(this.matrix[i][j].value)
            }
            vals.push(newArr)
        }
    }

    moveCurrentPieceDown() {
        const centerX = this.currentPiece.getCenterPieceLoc().x
        const centerY = this.currentPiece.getCenterPieceLoc().y

        const bottomPieces = this.currentPiece.getBottomPieces()

        //copying object
        const piecesWithIndexes = []
        for (let piece of bottomPieces) {
            piecesWithIndexes.push(Object.assign({}, piece))
        }

        //changing relative indexes to actual indexes
        for (let piece of piecesWithIndexes) {
            piece.x += centerX
            piece.y += centerY
        }

        for (const piece of piecesWithIndexes) {
            // checking if there's a floor under
            if (piece.x == this.matrix.length - 1) {
                this.triggerCollisionBelow()
                return
            }

            if (this.matrix[piece.x + 1][piece.y].value) {
                this.triggerCollisionBelow()
                return
            }
        }

        this.currentPiece.moveDown()
        this.updatePiece()

        this.printMatrix()
    }

    moveCurrentPieceRight() {
        const rightMostPieceI = this.currentPiece.getRightMost()
        // Checking if we can move right
        if (rightMostPieceI < 9) {
            this.currentPiece.moveRight()
            this.updatePiece()
        }
    }

    moveCurrentPieceLeft() {
        const leftMostPieceI = this.currentPiece.getLeftMost()
        // Checking if we can move left
        if (leftMostPieceI > 0) {
            this.currentPiece.moveLeft()
            this.updatePiece()
        }
    }

    rotateCurrentPiece() {
        rotateSound.play()
        this.currentPiece.rotate()
        this.updatePiece()

        let collisions = "checking"

        while (collisions !== "none") {
            collisions = this._helperCheckAnyCollision()
            switch (collisions) {
                case "left":
                    this.moveCurrentPieceRight()
                    break
                case "right":
                    this.moveCurrentPieceLeft()
                    break
                case "top":
                    this.moveCurrentPieceDown()
                    break
            }
        }
    }

    _helperCheckAnyCollision() {
        const leftMostPieceI = this.currentPiece.getLeftMost()
        const rightMostPieceI = this.currentPiece.getRightMost()
        const topMostPieceI = this.currentPiece.getTopMost()

        if (leftMostPieceI < 0) return "left"
        else if (rightMostPieceI > 9) return "right"
        else if (topMostPieceI < 2) return "top"

        return "none"
    }

    cleanPreviousLoc() {
        let orientation = this.currentPiece.getPreviousOrientation()
        let indexes = this.currentPiece.getPreviousIndexes()

        this.matrix[indexes.x][indexes.y] = {
            value: false,
            color: null,
        }
        for (const sq of orientation) {
            this.matrix[indexes.x + sq.x][indexes.y + sq.y] = {
                value: false,
                color: null,
            }
        }
    }

    triggerCollisionBelow() {
        //check full lines
        const fullLines = this.checkFullLines()

        if (fullLines.length > 0) {
            //clear
            this.clearLines(fullLines)

            //shift lines
            for (let i = fullLines.length - 1; i >= 0; i--) {
                this.shiftDown(fullLines[i], 1)
            }

            //Adding points to lines
            this.addLines(fullLines.length)
            //Add 10 points per line
            this.addScore(fullLines.length * 10)
        }

        // Check if game is won
        // else Check if game is lost
        // else Generate new piece and placing it again
        if (this.lineGoal <= this.lines) {
            this.stop()
            this.wonGame()
        } else if (this.isGameLost()) {
            this.stop()
            this.lostGame()
        } else {
            if (fullLines.length > 0) fullLineSound.play()
            else collisionSound.play()
            this.addScore(8) // Add 8 points per piece placed
            this.currentPiece = this.generateNewPiece(this.nextPiece)
            this.nextPiece = this.generatePieceType()
            this.updatePiece()
        }
    }

    generatePieceType() {
        let newType = pieceTypes[Math.floor(Math.random() * pieceTypes.length)]
        return newType
    }

    generateNewPiece(type) {
        let newP = null
        switch (type) {
            case "forwardL":
                newP = new ForwardL()
                break
            case "backwardL":
                newP = new BackwardL()
                break
            case "cube":
                newP = new Cube()
                break
            case "forwardS":
                newP = new ForwardS()
                break
            case "backwardS":
                newP = new BackwardS()
                break
            case "cross":
                newP = new Cross()
                break
            case "line":
                newP = new Line()
                break
        }
        return newP
    }

    checkFullLines() {
        const fullLines = []

        for (let i = this.matrix.length - 1; i > 1; i--) {
            let record = true
            for (let space of this.matrix[i]) {
                record = record && space.value
            }
            if (record) fullLines.push(i)
        }

        return fullLines
    }

    clearLines(indexes) {
        for (let i of indexes) {
            for (let piece of this.matrix[i]) {
                piece.color = null
                piece.value = false
            }
        }

        this.printMatrix
    }

    shiftDown(beginning, end) {
        let copyTo = beginning
        let copyFrom = beginning - 1

        for (; copyFrom >= end;) {
            let copy = []
            for (let piece of this.matrix[copyFrom]) {
                copy.push(Object.assign({}, piece))
            }
            this.matrix[copyTo] = copy
            copyFrom--
            copyTo--
        }
    }

    addLines(lines) {
        this.lines += lines
    }

    addScore(score) {
        this.score += score
    }

    isGameLost() {
        for (const piece of this.matrix[2]) {
            if (piece.value) return true
        }

        return false
    }

    wonGame() {
        this.hasWonOrLost = "won"
        wonSound.play()
    }

    lostGame() {
        this.hasWonOrLost = "lost"
        lostSound.play()
    }

    speedUp() {
        if (this.gameInterval) {
            clearInterval(this.gameInterval)
            this.gameInterval = setInterval(() => {
                this.timer += 0.2
                this.moveCurrentPieceDown()
            }, 200)
        }
    }

    slowDown() {
        if (this.gameInterval) {
            clearInterval(this.gameInterval)
            this.gameInterval = setInterval(() => {
                this.timer += 0.5
                this.moveCurrentPieceDown()
            }, 500)
        }
    }

    getMinutes() {
        let minutesNoSeconds = this.timer - this.getSeconds()
        return minutesNoSeconds / 60
    }

    getSeconds() {
        return Math.floor(this.timer) % 60
    }

    computeTwoDigitNumber(value) {
        if (value < 10) {
            return `0${Math.floor(value)}`
        } else {
            return `${Math.floor(value)}`
        }
    }

    getTimeString() {
        let minutes = this.computeTwoDigitNumber(this.getMinutes())
        let secs = this.computeTwoDigitNumber(this.getSeconds())
        return `${minutes}:${secs}`
    }
}
