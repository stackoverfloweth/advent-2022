import { input } from '@/11/input'

class Monkey {
  public id: number
  public items: number[]
  public inspectionCount: number = 0
  public readonly denominator: number
  private readonly operation: (number1: number, number2: number) => number
  private readonly operand: number | undefined
  private readonly assignments: number[]

  public constructor(input: string) {
    const regex = [
      /Monkey (\d+):$/g,
      /Starting items: (.*?)$/g,
      /Operation: new = old (.*?)$/g,
      /Test: divisible by (\d+)$/g,
      /If true: throw to monkey (\d+)$/g,
      /If false: throw to monkey (\d+)$/g,
    ]
    const lines = input.split('\n').map((line, index) => {
      const matches = regex[index].exec(line)

      if (!matches) {
        throw 'invalid monkey'
      }

      return matches[1]
    })

    const [id, starting, inspect, test, ifTrue, ifFalse] = lines
    this.id = parseInt(id)
    this.items = starting.split(', ').map(x => Number(x))
    const [operation, operand] = inspect.split(' ')
    this.operation = operation === '*' ? this.multiply : this.add
    this.operand = operand === 'old' ? undefined : Number(operand)
    this.denominator = Number(test)
    this.assignments = [ifFalse, ifTrue].map(Number)
  }

  public inspect(item: number): number {
    this.inspectionCount ++

    return this.operation(item, this.operand ?? item) % lcm
  }

  public getNextMonkey(item: number): number {
    return this.assignments[Number(this.test(item))]
  }

  private test(item: number): boolean {
    return item % this.denominator === 0
  }

  private multiply(number1: number, number2: number): number {
    return number1 * number2
  }

  private add(number1: number, number2: number): number {
    return number1 + number2
  }
}

function leastCommonMultiple(...args: number[]): number {
  const max = Math.max(...args)

  let i = max
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-constant-condition
  while (true) {
    if (args.every(arg => i % arg === 0)) {
      return i
    }
    i += max
  }
}

const monkeys = new Map<number, Monkey>()
input.split('\n\n').forEach(input => {
  const monkey = new Monkey(input)

  monkeys.set(monkey.id, monkey)
})
const lcm = leastCommonMultiple(...Array.from(monkeys.values()).map(monkey => monkey.denominator))

function passToMonkey(id: number, item: number): void {
  monkeys.get(id)?.items.push(item)
}

function startTurn(monkey: Monkey): void {
  let item = monkey.items.shift()

  while (item !== undefined) {
    const updatedItem = monkey.inspect(item)
    const nextMonkey = monkey.getNextMonkey(updatedItem)

    passToMonkey(nextMonkey, updatedItem)
    item = monkey.items.shift()
  }
}

function startRound(): void {
  for (const [, monkey] of monkeys) {
    startTurn(monkey)
  }
}

function sortByInspectionCount(monkeys: Monkey[]): Monkey[] {
  return monkeys.sort((monkey1, monkey2) => monkey2.inspectionCount - monkey1.inspectionCount)
}

function calculateMonkeyBusiness(): number {
  for (let index = 0; index < 10000; index++) {
    startRound()
  }

  const [highest, secondHighest] = sortByInspectionCount(Array.from(monkeys.values()))
  return highest.inspectionCount * secondHighest.inspectionCount
}

console.log(calculateMonkeyBusiness())

// 32348900163 too high
