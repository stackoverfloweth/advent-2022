import { input } from './input'

const rucksacks = input.split('\n')

function splitIntoCompartments(value: string): [string, string] {
  return [
    value.slice(0, value.length / 2),
    value.slice(value.length / 2),
  ]
}

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
  const value = rucksacks.reduce((total, rucksack) => {
    const compartments = splitIntoCompartments(rucksack)
    const intersections = findIntersection(compartments)
    total += getPriority(intersections[0])

    return total
  }, 0)

  console.log(value)
}

solve()