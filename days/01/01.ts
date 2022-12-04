import { input } from './input'

function getSnacks(data: string): number[] {
  return data.split('\n').map(calories => parseInt(calories))
}

function sumCalories(snacks: number[]): number {
  return snacks.reduce((sum, snack) => sum + snack, 0)
}

function findMax(range: number[]): number {
  return range.reduce((max, value) => value > max ? value : max, 0)
}

function solve(): void {
  const elves = input.split('\n\n')
  const snacksPerElf = elves.map(getSnacks)
  const totalCaloriesPerElf = snacksPerElf.map(sumCalories)

  console.log(findMax(totalCaloriesPerElf))
}

solve()