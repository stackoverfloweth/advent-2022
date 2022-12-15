export type Direction = 'R' | 'U' | 'L' | 'D'
export type Instruction = [Direction, number]
export type Position = [x:number, y:number]

export function isDirection(value: unknown): value is Direction {
  return ['R', 'U', 'L', 'D'].includes(value as string)
}

export class TailHistory {
  private readonly history: Set<string>

  public constructor() {
    this.history = new Set<string>()
  }

  public add(position: Position): void {
    this.history.add(JSON.stringify(position))
  }

  public get count(): number {
    return this.history.size
  }
}