'use strict'
var gBoard
var gIntervalSecs

const MINE_IMG = '💣'

const gLevel = {
    SIZE: 4,
    MINES: 2
}

const gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 2,
    isHint: false,
    safeClicksCount: 3
}

function onInit() {
    const elSafeClicks = document.querySelector('.safe-clicks')
    const elWin = document.querySelector('.win')
    elWin.style.display = 'none'
    elSafeClicks.style.display = 'block'
    renderSubtitle()
    
    gGame.secsPassed = 0
    gGame.isOn = true
    gGame.shownCount = 0
    gGame.safeClicksCount = 3
    
    clearInterval(gIntervalSecs)

    gBoard = buildBoard()
    renderBoard(gBoard, '.board-container')
}

function buildBoard() {
    const board = []

    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: null,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    return board
}

function renderBoard(mat, selector) {

    var strHTML = '<table><tbody>'
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {
            const currCell = mat[i][j]

            setMinesNegsCount(i, j)

            var cellClass = getClassName({ i, j })

            if (gBoard[i][j].isMine) cellClass += ' mine'
            // else if (!currCell.minesAroundCount) cellClass += ' no-negs'

            strHTML += `<td class="cell ${cellClass}"`

            strHTML += `onclick="onCellClicked(this,${i},${j})" 
            oncontextmenu="onCellMarked(event,this,${i},${j})">`

            strHTML += '</td>'
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}

function renderCell(location, value) {
    const cellSelector = '.' + getClassName(location)
    const elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value
    elCell.style.backgroundColor = value === ' ' ? 'rgb(155, 205, 249)' : 'azure'
}


function createsMines(board) {
    for (var i = 0; i < gLevel.MINES; i++) {
        var idxI = getRandomInt(0, gLevel.SIZE)
        var idxJ = getRandomInt(0, gLevel.SIZE)

        if (!board[idxI][idxJ].isMine) board[idxI][idxJ].isMine = true
        else i -= 1
    }
}

function setMinesNegsCount(row, col) {
    const negs = []
    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue
            if (i === row && j === col) continue

            if (gBoard[i][j].isMine) gBoard[row][col].minesAroundCount++
            negs.push({ i, j })
        }
    }
    return negs
}

function expandShown(row, col) {
    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue

        for (var j = col - 1; j <= col + 1; j++) {

            if (j < 0 || j >= gBoard[0].length) continue
            if (i === row && j === col || gBoard[i][j].isMarked) continue
            gBoard[i][j].isShown = true
            renderCell({ i, j }, gBoard[i][j].minesAroundCount)
        }
    }
}

function renderSubtitle() {
    const live = gGame.lives + '❤️'
    const dead = gGame.lives + '🤍'

    const elLives = document.querySelector('.lives')
    const elTimer = document.querySelector('.timer')
    const elSafe = document.querySelector('.safe')

    elLives.innerText = gGame.lives ? live : dead
    elTimer.innerText = gGame.secsPassed
    elSafe.innerText = gGame.safeClicksCount
}



function checkGameOver(elCell) {
    const elSmileyButton = document.querySelector('.smiley-button')
    gGame.lives--
    elCell.innerText = MINE_IMG

    renderSubtitle()
    renderSubtitle()

    if (!gGame.lives) checkLose()

    elSmileyButton.innerText = gGame.lives ? '😀' : '🙁'
}

function checkLose() {
    const elMines = document.querySelectorAll('.mine')
    gGame.isOn = false

    renderSubtitle()
    for (var i = 0; i < gLevel.MINES; i++) {
        elMines[i].innerText = MINE_IMG
    }

}

function checkWin() {
    if (!gGame.isOn) return
    const elSmileyButton = document.querySelector('.smiley-button')
    const elWin = document.querySelector('.win')

    const winMsg = `win!!! \n 🎉 \n seconds:${gGame.secsPassed}`

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            const currCell = gBoard[i][j]
            if (!currCell.isShown && !currCell.isMarked
                || currCell.isMine && !currCell.isMarked) return false
        }
    }

    clearInterval(gIntervalSecs)
    elWin.style.display = 'block'
    elWin.innerText = winMsg
    elSmileyButton.innerText = '💯'
}

function getTimer() {
    const elTimer = document.querySelector('.timer')
    if (!gGame.isOn) return

    gGame.secsPassed++;
    elTimer.innerText = gGame.secsPassed
}



