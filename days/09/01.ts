import { input } from './input'
import { Direction, Instruction, isDirection, Position, TailHistory } from './types'

function parseInstruction(value: string): Instruction {
  const [direction, amount] = value.split(' ')

  if (isDirection(direction)) {
    return [direction, parseInt(amount)]
  }

  throw 'invalid instruction'
}

let head: Position = [0, 0]
let tail: Position = [0, 0]
const tailHistory = new TailHistory()

// eslint-disable-next-line id-length
function move([x, y]: Position, direction: Direction): Position {
  switch (direction) {
    case 'R':
      return [x + 1, y]
    case 'L':
      return [x - 1, y]
    case 'U':
      return [x, y + 1]
    case 'D':
      return [x, y - 1]
  }
}

function tailNeedsToMove(): boolean {
  const [headX, headY] = head
  const [tailX, tailY] = tail

  return Math.abs(headX - tailX) > 1 || Math.abs(headY - tailY) > 1
}

function moveRope(direction: Direction): void {
  const previousHead: Position = [...head]

  head = move(head, direction)

  if (tailNeedsToMove()) {
    tail = previousHead
  }

  tailHistory.add(tail)
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
