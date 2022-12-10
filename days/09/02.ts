/* eslint-disable id-length */
import { input } from './input'
import { Direction, Instruction, isDirection, Position, TailHistory } from './types'

function parseInstruction(value: string): Instruction {
  const [direction, amount] = value.split(' ')

  if (isDirection(direction)) {
    return [direction, parseInt(amount)]
  }

  throw 'invalid instruction'
}

let rope: Position[] = new Array(10).fill([0, 0])
const tailHistory = new TailHistory()

function moveRope(direction: Direction): void {
  rope = getNextRope(direction)

  const tail = rope[rope.length - 1]
  tailHistory.add(tail)
}

function getNextRope(direction: Direction): Position[] {
  const [head, ...rest] = rope

  const headMovement = getDirectionMovement(direction)
  const newHead = applyMovement(head, headMovement)

  const updatedRope = [newHead, ...rest]

  for (let index = 1; index < rope.length; index++) {
    const movement = getFollowMovement(updatedRope[index - 1], updatedRope[index])
    updatedRope[index] = applyMovement(updatedRope[index], movement)
  }

  return updatedRope
}

const followRules: Record<number, Record<number, Position>> = {
  [0]: {
    [0]: [0, 0],
    [1]: [0, 0],
    [-1]: [0, 0],
    [2]: [0, 1],
    [-2]: [0, -1],
  },
  [1]: {
    [0]: [0, 0],
    [1]: [0, 0],
    [-1]: [0, 0],
    [2]: [1, 1],
    [-2]: [1, -1],
  },
  [-1]: {
    [0]: [0, 0],
    [1]: [0, 0],
    [-1]: [0, 0],
    [2]: [-1, 1],
    [-2]: [-1, -1],
  },
  [2]: {
    [0]: [1, 0],
    [1]: [1, 1],
    [-1]: [1, -1],
    [2]: [1, 1],
    [-2]: [1, -1],
  },
  [-2]: {
    [0]: [-1, 0],
    [1]: [-1, 1],
    [-1]: [-1, -1],
    [2]: [-1, 1],
    [-2]: [-1, -1],
  },
}

function getFollowMovement([headX, headY]: Position, [tailX, tailY]: Position): Position {
  return followRules[headX - tailX][headY - tailY]
}

function getDirectionMovement(direction: Direction): Position {
  switch (direction) {
    case 'R':
      return [+1, 0]
    case 'L':
      return [-1, 0]
    case 'U':
      return [0, +1]
    case 'D':
      return [0, -1]
  }
}

function applyMovement([x, y]: Position, [changeX, changeY]: Position): Position {
  return [x + changeX, y + changeY]
}

function solve(): void {
  input.split('\n')
    .map(parseInstruction)
    .forEach(([direction, amount]) => {
      for (let index = 0; index < amount; index++) {
        moveRope(direction)
      }
    })

  console.log(tailHistory.count)
}

solve()
