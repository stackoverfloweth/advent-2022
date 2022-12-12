/* eslint-disable id-length */
import { input } from './input'
import { Path } from './path'
import { Point } from './point'

const map = input.split('\n').map((row, x) => row.split('').map((key, y) => new Point(x, y, key)))
const [start] = map.find(row => row.find(point => point.key === 'S'))!
let paths: Path[] = [new Path(start)]
const completedPaths: Path[] = []

const directions = [
  ({ x, y }: Point) => [x - 1, y],
  ({ x, y }: Point) => [x, y - 1],
  ({ x, y }: Point) => [x + 1, y],
  ({ x, y }: Point) => [x, y + 1],
]

function getPoint(x: number, y: number): Point | undefined {
  try {
    return map[x][y]
  } catch {
    return undefined
  }
}

function getMinimumCompletedDistance(): number {
  return completedPaths.reduce((smallest, path) => {
    return path.distance < smallest ? path.distance : smallest
  }, 30)
}

while (paths.length > 0) {
  const nextPaths: Path[] = []

  paths.forEach(path => {
    directions.forEach(direction => {
      const [x, y] = direction(path.current)

      const point = getPoint(x, y)
      if (point && path.canTravelTo(point)) {
        const nextPath = path.travel(point)

        if (nextPath.isAtFinish) {
          completedPaths.push(nextPath)
        } else if (nextPath.distance < getMinimumCompletedDistance()) {
          nextPaths.push(nextPath)
        }
      }
    })
  })

  paths = nextPaths
}

console.log(getMinimumCompletedDistance())