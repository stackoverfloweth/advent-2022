import { demo } from './input'

class Monkey {
  public id: number
  public items: bigint[]
  public inspectionCount: number = 0
  private readonly operation: (number1: bigint, number2: bigint) => bigint
  private readonly operand: bigint | undefined
  private readonly denominator: bigint
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
    this.items = starting.split(', ').map(x => BigInt(x))
    const [operation, operand] = inspect.split(' ')
    this.operation = operation === '*' ? this.multiply : this.add
    this.operand = operand === 'old' ? undefined : BigInt(operand)
    this.denominator = BigInt(test)
    this.assignments = [ifFalse, ifTrue].map(Number)
  }

  public inspect(item: bigint): bigint {
    this.inspectionCount ++

    return this.operation(item, this.operand ?? item)
  }

  public getNextMonkey(item: bigint): number {
    return this.assignments[Number(this.test(item))]
  }

  private test(item: bigint): boolean {
    return item % this.denominator === 0n
  }

  private multiply(number1: bigint, number2: bigint): bigint {
    return number1 * number2
  }

  private add(number1: bigint, number2: bigint): bigint {
    return number1 + number2
  }
}

const monkeys = new Map<number, Monkey>()
demo.split('\n\n').forEach(input => {
  const monkey = new Monkey(input)

  monkeys.set(monkey.id, monkey)
})

function passToMonkey(id: number, item: bigint): void {
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
  console.log([highest, secondHighest])
  return highest.inspectionCount * secondHighest.inspectionCount
}

console.log(calculateMonkeyBusiness())

// 32348900163 too high
