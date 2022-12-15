export const elevation = 'SabcdefghijklmnopqrstuvwxyzE'
export class Point {
  public x: number
  public y: number
  public key: string
  public elevation: number
  public totalDistance = Infinity
  public visited = false

  public constructor(x: number, y: number, key: string) {
    this.x = x
    this.y = y
    this.key = key
    this.elevation = elevation.indexOf(key)
  }

  public canVisit(point: Point): boolean {
    return this.elevation + 1 >= point.elevation
  }
}
