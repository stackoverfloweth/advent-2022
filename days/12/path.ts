import { Point } from './point'

export class Path {
  private readonly history
  public readonly current: Point

  public constructor(start: Point, history?: Set<string>) {
    this.current = start
    this.history = new Set<string>(history)
    this.addToHistory()
  }

  public travel(destination: Point): Path {
    return new Path(destination, this.history)
  }

  public canTravelTo(point: Point): boolean {
    return this.current.elevation + 1 >= point.elevation && !this.isInHistory(point)
  }

  public get distance(): number {
    return this.history.size
  }

  public get isAtFinish(): boolean {
    return this.current.key === 'E'
  }

  private addToHistory(): void {
    this.history.add(this.current.toString())
  }

  private isInHistory(point: Point): boolean {
    return this.history.has(point.toString())
  }
}