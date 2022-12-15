import { input } from '@/05/input'

class Procedure {
  public from: number
  public to: number
  public count: number

  public constructor(values: { from: number, to: number, count: number }) {
    this.from = this.toZeroBased(values.from)
    this.to = this.toZeroBased(values.to)
    this.count = values.count
  }

  private toZeroBased(input: number): number {
    return input - 1
  }
}

function mapProcedure(input: string): Procedure {
  const regexp = /move (\d+) from (\d+) to (\d+)/g
  const value = regexp.exec(input)

  if (!value?.length) {
    throw 'Invalid input detected'
  }

  const [count, from, to] = value.slice(1, 4).map(x => parseInt(x))

  return new Procedure({
    count, from, to,
  })
}

const procedures = input.split('\n').map(mapProcedure)

const stacks = [
  'BWN',
  'LZSPTDMB',
  'QHZWR',
  'WDVJZR',
  'SHMB',
  'LGNJHVPB',
  'JQZFHDLS',
  'WSFJGQB',
  'ZWMSCDJ',
].map(x => x.split(''))

procedures.forEach(procedure => {
  const crates = stacks[procedure.from].slice(-procedure.count)
  stacks[procedure.from] = stacks[procedure.from].slice(0, stacks[procedure.from].length - procedure.count)

  stacks[procedure.to].push(...crates)
})

const lastCrates = stacks.map(stack => stack.pop())

console.log(lastCrates.join(''))