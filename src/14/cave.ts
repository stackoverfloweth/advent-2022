import { Rock, Sand, TracePath, Position } from '@/14/types'

export class Cave {
  protected readonly map = new Map<string, Rock | Sand | undefined>()
  public readonly maxDepth: number

  public constructor(tracePaths: TracePath[]) {
    tracePaths.forEach(path => {
      this.mapPath(path)
    })

    this.maxDepth = this.getMaxDepth()
  }

  public setPositionInCave(position: Position, value: Rock | Sand): void {
    const key = this.getPositionKey(position)

    this.map.set(key, value)
  }

  public getPositionInCave([x, y]: Position): undefined | Rock | Sand {
    const key = this.getPositionKey([x, y])

    return this.map.get(key)
  }

  public getPositionKey([x, y]: Position): string {
    return `${x}:${y}`
  }

  public getKeyPosition(key: string): Position {
    const [x, y] = key.split(':').map(Number)

    return [x, y]
  }

  protected mapPath(path: TracePath): void {
    let previousPosition: Position | undefined

    path.forEach(position => {
      this.setPositionInCave(position, '#')

      if (previousPosition !== undefined) {
        const { change, times } = this.getPathDirection(previousPosition, position)

        for (let index = 0; index < times; index++) {
          previousPosition = change(previousPosition)
          this.setPositionInCave(previousPosition, '#')
        }
      }

      previousPosition = position
    })
  }

  protected getMaxDepth(): number {
    return Array.from(this.map.keys()).reduce((max, key) => {
      const [, y] = this.getKeyPosition(key)

      return y > max ? y : max
    }, 0)
  }

  protected getPathDirection([startX, startY]: Position, [endX, endY]: Position): {
    change: (position: Position) => Position,
    times: number,
  } {
    const x = endX - startX
    const y = endY - startY
    const times = Math.abs(x + y)

    return {
      change: ([currentX, currentY]) => [currentX + x / times, currentY + y / times],
      times: Math.abs(x + y),
    }
  }
}