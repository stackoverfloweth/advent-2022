import { input } from './input'

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
  for (let index = 0; index < procedure.count; index++) {
    const crate = stacks[procedure.from].pop()

    if (crate) {
      stacks[procedure.to].push(crate)
    }
  }
})

const lastCrates = stacks.map(stack => stack.pop())

console.log(lastCrates.join(''))
