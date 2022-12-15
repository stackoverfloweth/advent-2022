import { input } from '@/12/input'
import { Point } from '@/12/point'

export function getPointsByKey(map: Map<string, Point>, key: string): Point[] {
  const points = []

  for (const point of map.values()) {
    if (point.key === key) {
      points.push(point)
    }
  }

  return points
}

export function buildMap(input: string): Map<string, Point> {
  const map = new Map<string, Point>()

  input.split('\n').forEach((row, x) => row.split('').forEach((key, y) => {
    const point = new Point(x, y, key)

    map.set(getKey(map, point), point)
  }))

  return map
}

export function getKey(map: Map<string, Point>, point: Point): string
// eslint-disable-next-line no-redeclare, @typescript-eslint/unified-signatures
export function getKey(map: Map<string, Point>, [x, y]: [number, number]): string
// eslint-disable-next-line no-redeclare
export function getKey(map: Map<string, Point>, pointOrCoordinates: Point | [number, number]): string {
  if (pointOrCoordinates instanceof Point) {
    return getKey(map, [pointOrCoordinates.x, pointOrCoordinates.y])
  }

  const [x, y] = pointOrCoordinates

  return `${x}:${y}`
}

export function visitPoint(map: Map<string, Point>, point: Point): void {
  const neighbors = [
    [-1, 0],
    [0, -1],
    [1, 0],
    [0, 1],
  ]

  neighbors.forEach(([x, y]) => {
    const key = getKey(map, [point.x + x, point.y + y])

    if (map.has(key)) {
      const neighbor = map.get(key)!

      if (point.canVisit(neighbor) && neighbor.totalDistance > point.totalDistance + 1) {
        neighbor.totalDistance = point.totalDistance + 1
      }
    }
  })

  point.visited = true
}

export function getUnvisitedNodes(map: Map<string, Point>): Point[] {
  return Array.from(map.values())
    .filter(x => !x.visited)
    .sort((a, b) => a.totalDistance - b.totalDistance)
}

export function getShortestDistance(map: Map<string, Point>, start: Point, end: Point): number {
  start!.totalDistance = 0

  let unvisitedNodes = getUnvisitedNodes(map)
  while (unvisitedNodes.length) {
    visitPoint(map, unvisitedNodes[0])
    unvisitedNodes = getUnvisitedNodes(map)
  }

  return end.totalDistance
}

function solve(): void {
  const map = buildMap(input)
  const [start] = getPointsByKey(map, 'S')
  const [end] = getPointsByKey(map, 'E')

  console.log(getShortestDistance(map, start, end))
}

solve()