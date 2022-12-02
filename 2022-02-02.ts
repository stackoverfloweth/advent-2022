import { input } from './2022-02-input'

const rock = 'A'
type Rock = typeof rock
function isRock(value: unknown): value is Rock {
  return value === rock
}
const paper = 'B'
type Paper = typeof paper
function isPaper(value: unknown): value is Paper {
  return value === paper
}
const scissors = 'C'
type Scissors = typeof scissors
type Play = Rock | Paper | Scissors

const lose = 'X'
type Lose = typeof lose
const draw = 'Y'
type Draw = typeof draw
function isDraw(value: unknown): value is Draw {
  return value === draw
}
const win = 'Z'
type Win = typeof win
function isWin(value: unknown): value is Win {
  return value === win
}
type Result = Win | Lose | Draw

const map: Record<Play, Record<Result, Play>> = {
  A: {
    X: 'C',
    Y: 'A',
    Z: 'B',
  },
  B: {
    X: 'A',
    Y: 'B',
    Z: 'C',
  },
  C: {
    X: 'B',
    Y: 'C',
    Z: 'A',
  },
}

function getShapeScore(value: Play): number {
  if (isRock(value)) {
    return 1
  }
  if (isPaper(value)) {
    return 2
  }
  return 3
}

function getResultScore(value: Result): number {
  if (isWin(value)) {
    return 6
  }

  if (isDraw(value)) {
    return 3
  }

  return 0
}

function chooseShape(opponent: Play, outcome: Result): Play {
  return map[opponent][outcome]
}

function scoreRound(round: string): number {
  const [opponent, result] = round.split(' ') as [Play, Result]
  const resultScore = getResultScore(result)
  const myShape = chooseShape(opponent, result)
  const shapeScore = getShapeScore(myShape)

  return resultScore + shapeScore
}

const rounds = input.split('\n')
console.log(rounds.reduce((sum, round) => sum + scoreRound(round), 0))