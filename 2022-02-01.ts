import { input } from './2022-02-input'

type Rock = 'A' | 'X'
function isRock(value: unknown): value is Rock {
  return value === 'A' || value === 'X'
}
type Paper = 'B' | 'Y'
function isPaper(value: unknown): value is Paper {
  return value === 'B' || value === 'Y'
}
type Scissors = 'C' | 'Z'
function isScissors(value: unknown): value is Scissors {
  return value === 'C' || value === 'Z'
}
type Play = Rock | Paper | Scissors

const wins = [[isRock, isPaper], [isPaper, isScissors], [isScissors, isRock]]

function getShapeScore(value: Play): number {
  if (isRock(value)) {
    return 1
  }
  if (isPaper(value)) {
    return 2
  }
  return 3
}

function getResultScore(value: boolean | undefined): number {
  if (value === true) {
    return 6
  }

  if (value === undefined) {
    return 3
  }

  return 0
}

function playRound(player1: Play, player2: Play): boolean | undefined {
  for (const [loser, winner] of wins) {
    if (loser(player1) && winner(player2)) {
      return true
    }

    if (winner(player1) && loser(player2)) {
      return false
    }
  }
}

function scoreRound(round: string): number {
  const [opponent, myself] = round.split(' ') as [Play, Play]
  const result = playRound(opponent, myself)
  const resultScore = getResultScore(result)
  const shapeScore = getShapeScore(myself)

  return resultScore + shapeScore
}

const rounds = input.split('\n')
console.log(rounds.reduce((sum, round) => sum + scoreRound(round), 0))