import { input } from './input'

class Monkey {
  public id: number
  public items: number[]
  public inspectionCount: number = 0
  private readonly operation: string
  private readonly denominator: number
  private readonly assignments: number[]

  public constructor(input: string) {
    const regex = [
      /Monkey (\d+):$/g,
      /Starting items: (.*?)$/g,
      /Operation: new = (.*?)$/g,
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

    const [id, starting, operation, test, ifTrue, ifFalse] = lines
    this.id = parseInt(id)
    this.items = starting.split(', ').map(Number)
    this.operation = operation
    this.denominator = parseInt(test)
    this.assignments = [ifFalse, ifTrue].map(Number)
  }

  public inspect(item: number): number {
    this.inspectionCount ++
    const value = eval(this.operation.replace(/old/g, `${item}`))

    return Math.floor(value / 3)
  }

  public getNextMonkey(item: number): number {
    return this.assignments[Number(this.test(item))]
  }

  private test(item: number): boolean {
    return item % this.denominator === 0
  }
}

const monkeys = input.split('\n\n').map(input => new Monkey(input))

function passToMonkey(id: number, item: number): void {
  monkeys.find(monkey => monkey.id === id)?.items.push(item)
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
  for (const monkey of monkeys) {
    startTurn(monkey)
  }
}

function sortByInspectionCount(monkeys: Monkey[]): Monkey[] {
  return monkeys.sort((monkey1, monkey2) => monkey2.inspectionCount - monkey1.inspectionCount)
}

function calculateMonkeyBusiness(): number {
  for (let index = 0; index < 20; index++) {
    startRound()
  }

  const [highest, secondHighest] = sortByInspectionCount(monkeys)
  return highest.inspectionCount * secondHighest.inspectionCount
}

console.log(calculateMonkeyBusiness())