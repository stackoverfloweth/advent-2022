import { input } from '@/01/input'

function getSnacks(data: string): number[] {
  return data.split('\n').map(calories => parseInt(calories))
}

function sumCalories(snacks: number[]): number {
  return snacks.reduce((sum, snack) => sum + snack, 0)
}

function findMaxIndex(range: number[]): number {
  return range.reduce((maxIndex, value, index) => value > range[maxIndex] ? index : maxIndex, 0)
}

function solve(): void {
  const elves = input.split('\n\n')
  const snacksPerElf = elves.map(getSnacks)
  const totalCaloriesPerElf = snacksPerElf.map(sumCalories)

  let top3Sum = 0
  for (let i = 0; i < 3; i++) {
    const topElf = findMaxIndex(totalCaloriesPerElf)
    top3Sum += totalCaloriesPerElf[topElf]

    totalCaloriesPerElf.splice(topElf, 1)
  }

  console.log(top3Sum)
}

solve()