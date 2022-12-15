import { Cave } from '@/14/cave'
import { input } from '@/14/input'
import { TracePath, Position } from '@/14/types'

function scan(input: string): TracePath[] {
  return input.split('\n').map(path => path.split(' -> ').map(position => {
    const [x, y] = position.split(',').map(Number)

    return [x, y]
  }))
}

function sandFall(cave: Cave, [x, y]: Position): Position | undefined {
  let value = cave.getPositionInCave([x, y])
  while (value === undefined) {
    if (y > cave.maxDepth || y < 0) {
      return undefined
    }
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

  return sandFall(cave, start)
}

function solve(): void {
  const tracePaths = scan(input)
  const cave = new Cave(tracePaths)

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