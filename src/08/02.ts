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

function getBestScenicScoreForInteriorTrees(): number {
  let bestScenicScore = 0

  for (let rowIndex = 1; rowIndex < map.length - 1; rowIndex++) {
    const row = map[rowIndex]

    for (let colIndex = 1; colIndex < row.length - 1; colIndex++) {
      const score = getScenicScoreForCoordinates([rowIndex, colIndex])

      if (score > bestScenicScore) {
        bestScenicScore = score
      }
    }
  }

  return bestScenicScore
}

function getScenicScoreForCoordinates([x, y]: Coordinates): number {
  const tree = getTree([x, y])

  if (tree === undefined) {
    throw 'invalid coordinates for target tree'
  }

  return [
    countVisibleTrees(tree, [x + 1, y], ([x, y]: Coordinates) => [x + 1, y]),
    countVisibleTrees(tree, [x, y + 1], ([x, y]: Coordinates) => [x, y + 1]),
    countVisibleTrees(tree, [x - 1, y], ([x, y]: Coordinates) => [x - 1, y]),
    countVisibleTrees(tree, [x, y - 1], ([x, y]: Coordinates) => [x, y - 1]),
  ].reduce((product, next) => product * next, 1)
}

// eslint-disable-next-line max-params
function countVisibleTrees(tree: number, coordinates: Coordinates, getNextCoordinates: (coordinates: Coordinates) => Coordinates, visibleCount: number = 0): number {
  const target = getTree(coordinates)

  if (target === undefined) {
    return visibleCount
  }

  if (target >= tree) {
    return visibleCount + 1
  }

  return countVisibleTrees(tree, getNextCoordinates(coordinates), getNextCoordinates, visibleCount + 1)
}

const map = buildTreeMap(input)

function solve(): void {
  const answer = getBestScenicScoreForInteriorTrees()

  console.log(answer)
}

solve()