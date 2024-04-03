// Colors
// Default: rgb(117, 113, 113);
// ForwardL: rgb(230,162,57)
// BackwardL: rgb(10,28,208)
// Cube: rgb(241,238,79)
// ForwardS: rgb(110,235,71)
// BackwardS: rgb(221,47,33)
// Cross: rgb(145,45,231)
// Line: rgb(108,237,238)

class Piece {
    // currentOrientation: index of current orientation object
    // centerPiece: indexes of centerPiece in Tetris Matrix
    // orientations: objects with indexes of the other squares relative to center piece

    constructor() {
        this.currentOrientation = 0
        this.centerPieceIndexes = {
            x: 2,
            y: 5,
        }
        this.orientations = [[]] // to be built in extended classes
        this.previousIndexes = null
        this.previousOrientation = null
    }

    // returns current orientation of piece
    getOrientation() {
        return this.orientations[this.currentOrientation]
    }
    // returns indexes of centerpiece
    getCenterPieceLoc() {
        return this.centerPieceIndexes
    }

    // returns previous center's index to help with deletion of true booleans in matrix
    getPreviousIndexes() {
        return this.previousIndexes
    }

    // returns previous orientation to help with deletion of true booleans in matrix
    getPreviousOrientation() {
        return this.orientations[this.previousOrientation]
    }

    // get Bottom Pieces
    getBottomPieces() {
        return this.bottomPieces[this.currentOrientation]
    }

    // turn right by adding one to the orientation index,
    // and moding by the amount of orientations available to avoid out of bounds
    // errors in orientations array
    //
    // used Object.assign to copy by value and not by reference

    rotate() {
        this.previousIndexes = Object.assign({}, this.centerPieceIndexes)
        this.previousOrientation = this.currentOrientation
        this.currentOrientation =
            (this.currentOrientation + 1) % this.orientations.length

        return this.currentOrientation
    }

    moveDown() {
        this.previousIndexes = Object.assign({}, this.centerPieceIndexes)
        this.previousOrientation = this.currentOrientation
        this.centerPieceIndexes.x++
        return this.centerPieceIndexes
    }

    moveRight() {
        this.previousIndexes = Object.assign({}, this.centerPieceIndexes)
        this.previousOrientation = this.currentOrientation
        this.centerPieceIndexes.y++
        return this.centerPieceIndexes
    }

    moveLeft() {
        this.previousIndexes = Object.assign({}, this.centerPieceIndexes)
        this.previousOrientation = this.currentOrientation
        this.centerPieceIndexes.y--
        return this.centerPieceIndexes
    }

    getRightMost() {
        let maxRight = this.centerPieceIndexes.y

        for (const sq of this.getOrientation()) {
            maxRight =
                maxRight > this.centerPieceIndexes.y + sq.y
                    ? maxRight
                    : this.centerPieceIndexes.y + sq.y
        }

        return maxRight
    }

    getLeftMost() {
        let minLeft = this.centerPieceIndexes.y

        for (const sq of this.getOrientation()) {
            minLeft =
                minLeft < this.centerPieceIndexes.y + sq.y
                    ? minLeft
                    : this.centerPieceIndexes.y + sq.y
        }

        return minLeft
    }

    getTopMost() {
        let minTop = this.centerPieceIndexes.x
        for (const sq of this.getOrientation()) {
            minTop =
                minTop < this.centerPieceIndexes.x + sq.x
                    ? minTop
                    : this.centerPieceIndexes.x + sq.x
        }
        return minTop
    }
    // Returns both indeces since all columns are different
    getUnderMostIndeces() {
        let maxUnder = Object.assign({}, this.centerPieceIndexes)
        for (const sq of this.getOrientation()) {
            if (maxUnder.x < this.centerPieceIndexes.x + sq.x) {
                maxUnder.x = this.centerPieceIndexes.x + sq.x
                maxUnder.y = this.centerPieceIndexes.y + sq.y
            }
        }
        return maxUnder
    }
}

class ForwardL extends Piece {
    constructor() {
        super()
        this.localURL = "../images/pieces/forwardL.png"
        this.color = "rgb(230,162,57)"
        this.currentOrientation = 1
        this.orientations = [
            [
                { y: 0, x: -1 },
                { y: 0, x: 1 },
                { y: 1, x: 1 },
            ],
            [
                { y: 1, x: 0 },
                { y: -1, x: 0 },
                { y: -1, x: 1 },
            ],
            [
                { y: 0, x: 1 },
                { y: 0, x: -1 },
                { y: -1, x: -1 },
            ],
            [
                { y: -1, x: 0 },
                { y: 1, x: 0 },
                { y: 1, x: -1 },
            ],
        ]
        this.bottomPieces = [
            [
                { y: 0, x: 1 },
                { y: 1, x: 1 },
            ],
            [
                { y: 0, x: 0 },
                { y: 1, x: 0 },
                { y: -1, x: 1 },
            ],
            [
                { y: 0, x: 1 },
                { y: -1, x: -1 },
            ],
            [
                { y: 0, x: 0 },
                { y: -1, x: 0 },
                { y: 1, x: 0 },
            ],
        ]
    }
}

class BackwardL extends Piece {
    constructor() {
        super()
        this.localURL = "../images/pieces/backwardsL.png"
        this.color = "rgb(10,28,208)"
        this.currentOrientation = 3
        this.orientations = [
            [
                { y: 0, x: -1 },
                { y: 0, x: 1 },
                { y: -1, x: 1 },
            ],
            [
                { y: 1, x: 0 },
                { y: -1, x: 0 },
                { y: -1, x: -1 },
            ],
            [
                { y: 0, x: 1 },
                { y: 0, x: -1 },
                { y: 1, x: -1 },
            ],
            [
                { y: -1, x: 0 },
                { y: 1, x: 0 },
                { y: 1, x: 1 },
            ],
        ]
        this.bottomPieces = [
            [
                { y: 0, x: 1 },
                { y: -1, x: 1 },
            ],
            [
                { y: 0, x: 0 },
                { y: 1, x: 0 },
                { y: -1, x: 0 },
            ],
            [
                { y: 0, x: 1 },
                { y: 1, x: -1 },
            ],
            [
                { y: 0, x: 0 },
                { y: -1, x: 0 },
                { y: 1, x: 1 },
            ],
        ]
    }
}

class Cube extends Piece {
    constructor() {
        super()
        this.localURL = "../images/pieces/cube.png"
        this.color = "rgb(241,238,79)"
        this.orientations = [
            [
                { y: 1, x: 0 },
                { y: 0, x: 1 },
                { y: 1, x: 1 },
            ],
        ]
        this.bottomPieces = [
            [
                { y: 0, x: 1 },
                { y: 1, x: 1 },
            ],
        ]
    }
}

class ForwardS extends Piece {
    constructor() {
        super()
        this.localURL = "../images/pieces/forwardS.png"
        this.color = "rgb(110,235,71)"
        this.orientations = [
            [
                { y: 1, x: 0 },
                { y: -1, x: 1 },
                { y: 0, x: 1 },
            ],
            [
                { y: 0, x: 1 },
                { y: -1, x: -1 },
                { y: -1, x: 0 },
            ],
            [
                { y: -1, x: 0 },
                { y: 1, x: -1 },
                { y: 0, x: -1 },
            ],
            [
                { y: 0, x: -1 },
                { y: 1, x: 1 },
                { y: 1, x: 0 },
            ],
        ]
        this.bottomPieces = [
            [
                { y: 1, x: 0 },
                { y: -1, x: 1 },
                { y: 0, x: 1 },
            ],
            [
                { y: 0, x: 1 },
                { y: -1, x: 0 },
            ],
            [
                { y: 0, x: 0 },
                { y: -1, x: 0 },
                { y: 1, x: -1 },
            ],
            [
                { y: 0, x: 0 },
                { y: 1, x: 1 },
            ],
        ]
    }
}

class BackwardS extends Piece {
    constructor() {
        super()
        this.localURL = "../images/pieces/backwardS.png"
        this.color = "rgb(221,47,33)"
        this.orientations = [
            [
                { y: -1, x: 0 },
                { y: 1, x: 1 },
                { y: 0, x: 1 },
            ],
            [
                { y: 0, x: -1 },
                { y: -1, x: 1 },
                { y: -1, x: 0 },
            ],
            [
                { y: 1, x: 0 },
                { y: -1, x: -1 },
                { y: 0, x: -1 },
            ],
            [
                { y: 0, x: 1 },
                { y: 1, x: -1 },
                { y: 1, x: 0 },
            ],
        ]
        this.bottomPieces = [
            [
                { y: -1, x: 0 },
                { y: 1, x: 1 },
                { y: 0, x: 1 },
            ],
            [
                { y: 0, x: 0 },
                { y: -1, x: 1 },
            ],
            [
                { y: 0, x: 0 },
                { y: 1, x: 0 },
                { y: -1, x: -1 },
            ],
            [
                { y: 0, x: 1 },
                { y: 1, x: 0 },
            ],
        ]
    }
}

class Cross extends Piece {
    constructor() {
        super()
        this.localURL = "../images/pieces/cross.png"
        this.color = "rgb(145,45,231)"
        this.currentOrientation = 2
        this.orientations = [
            [
                { y: 0, x: -1 },
                { y: 1, x: 0 },
                { y: -1, x: 0 },
            ],
            [
                { y: 1, x: 0 },
                { y: 0, x: 1 },
                { y: 0, x: -1 },
            ],
            [
                { y: 0, x: 1 },
                { y: -1, x: 0 },
                { y: 1, x: 0 },
            ],
            [
                { y: -1, x: 0 },
                { y: 0, x: -1 },
                { y: 0, x: 1 },
            ],
        ]
        this.bottomPieces = [
            [
                { y: 0, x: 0 },
                { y: 1, x: 0 },
                { y: -1, x: 0 },
            ],
            [
                { y: 1, x: 0 },
                { y: 0, x: 1 },
            ],
            [
                { y: 0, x: 1 },
                { y: -1, x: 0 },
                { y: 1, x: 0 },
            ],
            [
                { y: -1, x: 0 },
                { y: 0, x: 1 },
            ],
        ]
    }
}

class Line extends Piece {
    constructor() {
        super()
        this.localURL = "../images/pieces/line.png"
        this.color = "rgb(108,237,238)"
        this.currentOrientation = 2
        this.orientations = [
            [
                { y: -1, x: 0 },
                { y: 1, x: 0 },
                { y: 2, x: 0 },
            ],
            [
                { y: 0, x: -1 },
                { y: 0, x: 1 },
                { y: 0, x: 2 },
            ],
            [
                { y: 1, x: 0 },
                { y: -1, x: 0 },
                { y: -2, x: 0 },
            ],
            [
                { y: 0, x: 1 },
                { y: 0, x: -1 },
                { y: 0, x: -2 },
            ],
        ]
        this.bottomPieces = [
            [
                { y: 0, x: 0 },
                { y: -1, x: 0 },
                { y: 1, x: 0 },
                { y: 2, x: 0 },
            ],
            [{ y: 0, x: 2 }],
            [
                { y: 0, x: 0 },
                { y: 1, x: 0 },
                { y: -1, x: 0 },
                { y: -2, x: 0 },
            ],
            [{ y: 0, x: 1 }],
        ]
    }
}
