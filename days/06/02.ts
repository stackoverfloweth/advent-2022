import { input } from './input'

console.log(solve(input, 14))

function isStartOfPacketMarker(buffer: string): boolean {
  return new Set(buffer).size === buffer.length
}

function solve(value: string, size: number): number {
  for (let index = 0; index < value.length - size; index++) {
    const buffer = value.substr(index, size)

    if (isStartOfPacketMarker(buffer)) {
      return index + size
    }
  }

  throw 'No start-of-packet marker found!'
}