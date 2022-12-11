import { input } from './input'

type AddX = {
  type: 'addx',
  args: number,
}
type Noop = {
  type: 'noop',
}
type Instruction = AddX | Noop
type Callback = () => void

class Clock {
  public tick: number = 0
  private readonly callbacks: Record<number, Callback | undefined> = {}

  public setCallback(callback: Callback, ticks: number): void {
    this.callbacks[this.tick + ticks] = callback
  }

  public next(): Callback | undefined {
    this.tick++

    return this.callbacks[this.tick]
  }

  public isReady(): boolean {
    return Object.entries(this.callbacks).filter(([key]) => parseInt(key) > this.tick).length === 0
  }
}

function parseInstruction(input: string): Instruction {
  const regex = /(addx|noop)\s?(\S+)?$/g
  const matches = regex.exec(input)

  if (!matches) {
    throw 'invalid input'
  }

  const [, type, possibleArgs] = matches
  const args = parseInt(possibleArgs)

  if (type === 'noop') {
    return { type }
  }

  if (type === 'addx' && !isNaN(args)) {
    return { type, args }
  }

  throw 'invalid format unknown'
}

const clock = new Clock()
const instructions = input.split('\n').map(parseInstruction)
const measurements: number[] = []
let x = 0

for (let index = 0; index < 6; index++) {
  let row = ''
  for (let pixelIndex = 0; pixelIndex < 40; pixelIndex++) {
    const instruction = clock.isReady() ? instructions.shift() : undefined
    const finished = clock.next()

    switch (instruction?.type) {
      case 'addx':
        clock.setCallback(() => x += instruction.args, 1)
        break
      case 'noop':
      default:
        break
    }

    if ([x, x + 1, x + 2].includes(pixelIndex)) {
      row += '#'
    } else {
      row += '.'
    }

    finished?.()
  }
  console.log(row)
}

console.log(measurements.reduce((sum, measurement) => sum + measurement, 0))