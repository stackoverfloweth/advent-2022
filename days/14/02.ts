/* eslint-disable id-length */
import { Cave } from './cave'
import { input } from './input'
import { TracePath, Position, Rock, Sand } from './types'

class CaveWithFloor extends Cave {
  public override getPositionInCave([x, y]: Position): undefined | Rock | Sand {
    if (y >= this.maxDepth + 2) {
      return '#'
    }

    const key = this.getPositionKey([x, y])

    return this.map.get(key)
  }
}

function scan(input: string): TracePath[] {
  return input.split('\n').map(path => path.split(' -> ').map(position => {
    const [x, y] = position.split(',').map(Number)

    return [x, y]
  }))
}

function sandFall(cave: Cave, [x, y]: Position): Position | undefined {
  let value = cave.getPositionInCave([x, y])
  while (value === undefined) {
    y++
    value = cave.getPositionInCave([x, y])
  }

  if (cave.getPositionInCave([x - 1, y]) === undefined) {
    return sandFall(cave, [--x, y])
  }

  if (cave.getPositionInCave([x + 1, y]) === undefined) {
    return sandFall(cave, [++x, y])
  }

  return [x, --y]
}

function pourSand(cave: Cave): Position | undefined {
  const start: Position = [500, 0]

  if (cave.getPositionInCave(start) === 'o') {
    return undefined
  }

  return sandFall(cave, start)
}

function solve(): void {
  const tracePaths = scan(input)
  const cave = new CaveWithFloor(tracePaths)

  let sandPoured = 0
  let position = pourSand(cave)
  while (position !== undefined) {
    cave.setPositionInCave(position, 'o')
    sandPoured++
    position = pourSand(cave)
  }

  console.log(sandPoured)
}

solve()