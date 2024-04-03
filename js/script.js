const game = new Tetris()
const tetrisCanvas = new Canvas()
const startBtn = document.getElementById("start-btn")
const pauseBtn = document.getElementById("pause-btn")
const continueBtn = document.getElementById("continue-btn")
const nextPieceImg = document.getElementById("next-piece-img")
const time = document.getElementById("time")
const lines = document.getElementById("lines")
const score = document.getElementById("score")
const goalsHTML = document.getElementsByClassName("goal")
const changeBtn = document.getElementById("change-goal-btn")
const goalLabel = document.getElementById("goal-label")
const goalInput = document.getElementById("goal-input")

pauseBtn.style.display = "none"
continueBtn.style.display = "none"
for (let els of goalsHTML) {
    els.innerHTML = game.lineGoal
}
let painterInterval = null
let timerInterval = null

/* function */
function updateNextPieceLink() {
    nextPieceImg.setAttribute("src", "images/pieces/" + game.nextPiece + ".png")
}

function updateLines() {
    lines.innerHTML = game.getLines()
}

function updateScore() {
    score.innerHTML = game.getScore()
}

function won() {
    modal.style.display = "block"
}

function updateLevel(level) {
    document.getElementById("level").textContent = level;
}

function checkAndUpdateLevel(linesCleared) {
    var level = "easy"; // level default

    if (linesCleared >= 15) {
        level = "Expert";
    } else if (linesCleared >= 10) {
        level = "hard";
    } else if (linesCleared >= 5) {
        level = "Medium";
    }

    updateLevel(level);
}

function goBack() {
    // Fungsi untuk kembali ke halaman sebelumnya
    window.history.back();
}

function toggleAudio() {
    var audio = document.getElementById("theme-sound");
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
}

// Autoplay audio when the page loads
window.onload = function () {
    var audio = document.getElementById("theme-sound");
    audio.play();
};

// Fungsi untuk memperbarui level
function updateLevel(level) {
    document.getElementById("level").textContent = level;
}

// Fungsi untuk memeriksa dan memperbarui level berdasarkan jumlah garis yang dihapus
function checkAndUpdateLevel(linesCleared) {
    var level = "Easy"; // level default

    if (linesCleared >= 15) {
        level = "Expert";
    } else if (linesCleared >= 10) {
        level = "Hard";
    } else if (linesCleared >= 5) {
        level = "Medium";
    }

    updateLevel(level);
}

// Fungsi untuk memperbarui level saat tombol "CHANGE" diklik
document.getElementById("change-goal-btn").addEventListener("click", function () {
    var goalInput = document.getElementById("goal-input");
    var goal = parseInt(goalInput.value);
    var level = document.getElementById("level");

    // Memastikan bahwa goal tidak kurang dari 0 atau negatif
    if (goal <= 0) {
        alert("Goal tidak boleh kurang dari sama dengan 0!");
        goalInput.value = ""; // Mengosongkan input
        return;
    }

    if (goal <= 5) {
        level.textContent = "Easy";
    } else if (goal <= 10) {
        level.textContent = "Medium";
    } else if (goal <= 15) {
        level.textContent = "Hard";
    } else if (goal > 15) {
        level.textContent = "Expert";
    }
})


/* Event */
document.addEventListener("keydown", (e) => {
    e.preventDefault()

    switch (e.keyCode) {
        case 32:
            // game.speedUp()
            break
        case 37:
            game.moveCurrentPieceLeft()
            break
        case 38:
            game.rotateCurrentPiece()
            break
        case 39:
            game.moveCurrentPieceRight()
            break
        case 40:
            game.moveCurrentPieceDown()
            break
        default:
            break
    }
})

// document.addEventListener("keyup", (e) => {
//   e.preventDefault()

//   switch (e.keyCode) {
//     case 32:
//       game.slowDown()
//       break
//   }
// })

startBtn.addEventListener("click", () => {
    if (painterInterval) clearInterval(painterInterval)
    if (timerInterval) clearInterval(timerInterval)

    game.start()

    for (let els of goalsHTML) {
        els.innerHTML = game.lineGoal
    }

    timerInterval = setInterval(() => {
        time.innerHTML = game.getTimeString()
    }, 1000)

    painterInterval = setInterval(() => {
        this.updateLines()
        this.updateScore()
        this.updateNextPieceLink()
        tetrisCanvas.paint(game.getMatrix())

        if (game.hasWonOrLost) {
            clearInterval(painterInterval)
            clearInterval(timerInterval)
            if (game.hasWonOrLost == "won") tetrisCanvas.paintWon()
            if (game.hasWonOrLost == "lost") tetrisCanvas.paintLost()
            pauseBtn.style.display = "none"
        }
    }, 100)

    timerInterval = setInterval(
        () => (time.innerHTML = game.getTimeString()),
        1000
    )

    continueBtn.style.display = "none"
    pauseBtn.style.display = ""
    startBtn.innerHTML = "<h2>RESTART</h2>"
})

pauseBtn.addEventListener("click", () => {
    game.stop()
    clearInterval(painterInterval)
    clearInterval(timerInterval)

    pauseBtn.style.display = "none"
    continueBtn.style.display = ""
})

continueBtn.addEventListener("click", () => {
    game.continue()

    timerInterval = setInterval(() => {
        time.innerHTML = game.getTimeString()
    }, 1000)

    painterInterval = setInterval(() => {
        this.updateLines()
        this.updateScore()
        this.updateNextPieceLink()
        tetrisCanvas.paint(game.getMatrix())

        if (game.hasWonOrLost) {
            clearInterval(painterInterval)
            clearInterval(timerInterval)
            if (game.hasWonOrLost == "won") {
                tetrisCanvas.paintWon()
            }
            if (game.hasWonOrLost == "lost") {
                tetrisCanvas.paintLost()
            }

            pauseBtn.style.display = "none"
        }
    }, 100)

    pauseBtn.style.display = ""
    continueBtn.style.display = "none"
})

changeBtn.addEventListener("click", () => {
    if (changeBtn.innerHTML === "CHANGE") {
        changeBtn.innerHTML = "SET"
        goalLabel.setAttribute("hidden", "")
        goalInput.removeAttribute("hidden")
    } else {
        changeBtn.innerHTML = "CHANGE"
        goalLabel.removeAttribute("hidden")
        goalInput.setAttribute("hidden", "")

        let newGoal = Number(goalInput.value)
        if (newGoal > 0) game.lineGoal = newGoal

        for (let els of goalsHTML) {
            els.innerHTML = game.lineGoal
        }
    }
})