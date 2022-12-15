import { buildMap, getPointsByKey, getShortestDistance, getKey } from '@/12/01'
import { input } from '@/12/input'

function solve(): void {
  const map = buildMap(input)
  const possibleStarts = getPointsByKey(map, 'a')

  const minDistance = possibleStarts.reduce((min, { x, y }) => {
    const map = buildMap(input)
    const key = getKey(map, [x, y])
    const start = map.get(key)!
    const [end] = getPointsByKey(map, 'E')
    const distance = getShortestDistance(map, start, end)

    return distance < min ? distance : min
  }, Infinity)

  console.log(minDistance)
}

solve()