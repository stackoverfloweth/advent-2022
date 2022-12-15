import { input } from './input'

type Value = number | Value[]

function getValues(input: string): Value[] {
  return input.replaceAll('\n\n', '\n').split('\n').map(value => parseValue(eval(value)))
}

function parseValue(value: string | unknown[]): Value {
  if (Array.isArray(value)) {
    return value.map(parseValue)
  }

  return parseInt(value)
}

function checkPairOrder([left, right]: [Value[], Value[]]): boolean | undefined {
  if (left.length === 0 && right.length !== 0) {
    return true
  }

  for (let index = 0; index < left.length; index++) {
    const isCorrect = checkValueOrder(left[index], right[index])

    if (isCorrect !== undefined) {
      return isCorrect
    }
  }

  return undefined
}

function checkValueOrder(left?: Value, right?: Value): boolean | undefined {
  if (left === right) {
    return undefined
  }

  if (left === undefined) {
    return true
  }

  if (right === undefined) {
    return false
  }

  if (Array.isArray(left) && !Array.isArray(right)) {
    return checkPairOrder([left, [right]])
  }

  if (!Array.isArray(left) && Array.isArray(right)) {
    return checkPairOrder([[left], right])
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    return checkPairOrder([left, right])
  }

  return left < right
}

function isSame(value1: Value, value2: Value): boolean {
  return JSON.stringify(value1) === JSON.stringify(value2)
}

function solve(): void {
  const markers = [[[2]], [[6]]]
  const values = [...markers, ...getValues(input)]

  const sorted = values.sort((value1, value2) => {
    const result = checkPairOrder([value1 as Value[], value2 as Value[]])

    if (result) {
      return -1
    }

    if (result === undefined) {
      return 0
    }

    return 1
  })

  const [marker1, marker2] = markers.map(marker => sorted.findIndex(value => isSame(marker, value)) + 1)

  console.log(marker1 * marker2)
}

solve()