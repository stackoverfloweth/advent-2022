import { input } from '@/03/input'

const rucksacks = input.split('\n')

function findIntersection(value: string[]): string[] {
  const [first, ...rest] = value

  return first.split('').reduce<string[]>((intersects, char) => {
    if (rest.every(x => x.includes(char))) {
      intersects.push(char)
    }

    return intersects
  }, [])
}

const priorityMap = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
function getPriority(character: string): number {
  return priorityMap.indexOf(character) + 1
}

function solve(): void {
  let total = 0

  while (rucksacks.length) {
    const set = [rucksacks.shift() ?? '', rucksacks.shift() ?? '', rucksacks.shift() ?? '']
    const intersections = findIntersection(set)
    total += getPriority(intersections[0])
  }

  console.log(total)
}

solve()