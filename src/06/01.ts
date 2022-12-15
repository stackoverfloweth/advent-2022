import { input } from '@/06/input'

console.log(solve(input))

function isStartOfPacketMarker(buffer: string): boolean {
  return new Set(buffer).size === buffer.length
}

function solve(value: string): number {
  for (let index = 0; index < value.length - 4; index++) {
    const buffer = value.substr(index, 4)

    if (isStartOfPacketMarker(buffer)) {
      return index + 4
    }
  }

  throw 'No start-of-packet marker found!'
}