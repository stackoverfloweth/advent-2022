import { input } from '@/08/input'

type Coordinates = [x:number, y:number]
type TreeMap = number[][]

function buildTreeMap(value: string): TreeMap {
  const map: TreeMap = []

  for (const row of value.split('\n')) {
    map.push(row.split('').map(Number))
  }

  return map
}

function getTree([x, y]: Coordinates): number | undefined {
  try {
    return map[x][y]
  } catch {
    return undefined
  }
}

function countVisibleInteriorTrees(): number {
  let visibleCount = 0

  for (let rowIndex = 1; rowIndex < map.length - 1; rowIndex++) {
    const row = map[rowIndex]

    for (let colIndex = 1; colIndex < row.length - 1; colIndex++) {
      if (isVisible([rowIndex, colIndex])) {
        visibleCount++
      }
    }
  }

  return visibleCount
}

function isVisible([x, y]: Coordinates): boolean {
  const tree = getTree([x, y])

  if (tree === undefined) {
    throw 'invalid coordinates for target tree'
  }

  return [
    checkVisibility(tree, [x + 1, y], ([x, y]: Coordinates) => [x + 1, y]),
    checkVisibility(tree, [x, y + 1], ([x, y]: Coordinates) => [x, y + 1]),
    checkVisibility(tree, [x - 1, y], ([x, y]: Coordinates) => [x - 1, y]),
    checkVisibility(tree, [x, y - 1], ([x, y]: Coordinates) => [x, y - 1]),
  ].some(visibility => visibility)
}

function checkVisibility(tree: number, coordinates: Coordinates, getNextCoordinates: (coordinates: Coordinates) => Coordinates): boolean {
  const target = getTree(coordinates)

  if (target === undefined) {
    return true
  }

  if (target >= tree) {
    return false
  }

  return checkVisibility(tree, getNextCoordinates(coordinates), getNextCoordinates)
}

const map = buildTreeMap(input)

function solve(): void {
  const interior = countVisibleInteriorTrees()
  const exterior = map.length * 2 + (map[0].length - 2) * 2
  const answer = interior + exterior

  console.log(answer)
}

solve()