/* eslint-disable id-length */

const elevation = 'SabcdefghijklmnopqrstuvwxyzE'
export class Point {
  public x: number
  public y: number
  public key: string
  public elevation: number

  public constructor(x: number, y: number, key: string) {
    this.x = x
    this.y = y
    this.key = key
    this.elevation = elevation.indexOf(key)
  }

  public toString(): string {
    return JSON.stringify([this.y, this.x, this.key])
  }
}
