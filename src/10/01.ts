import { input } from '@/10/input'

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
const measurableCycles = [20, 60, 100, 140, 180, 220]
const measurements: number[] = []
let x = 1

while (clock.tick < measurableCycles[measurableCycles.length - 1]) {
  const instruction = clock.isReady() ? instructions.shift() : undefined
  const finished = clock.next()

  if (measurableCycles.includes(clock.tick)) {
    measurements.push(x * clock.tick)
  }

  switch (instruction?.type) {
    case 'addx':
      clock.setCallback(() => x += instruction.args, 1)
      break
    case 'noop':
    default:
      break
  }

  finished?.()
}

console.log(measurements.reduce((sum, measurement) => sum + measurement, 0))