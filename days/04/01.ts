import { input } from './input'

const elfPairs = input.split('\n').map(pair => pair.split(',')) as [AssignmentString, AssignmentString][]

type AssignmentString = `${number}-${number}`
type Assignment = [number, number]

function getSections(input: AssignmentString): Assignment {
  const [first, second] = input.split('-').map(Number)

  return [first, second]
}

function checkOverlap(pair: [AssignmentString, AssignmentString]): boolean {
  const [first, second] = pair.map(getSections)

  return completelyOverlaps(first, second) || completelyOverlaps(second, first)
}

function completelyOverlaps(child: Assignment, parent: Assignment): boolean {
  const [childStart, childEnd] = child
  const [parentStart, parentEnd] = parent

  return childStart >= parentStart && childEnd <= parentEnd
}

const overlapCount = elfPairs.reduce((sum, pair) => {
  if (checkOverlap(pair)) {
    sum += 1
  }

  return sum
}, 0)

console.log(overlapCount)