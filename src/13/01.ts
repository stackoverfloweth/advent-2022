import { input } from './input'

type Value = number | Value[]
type Pair = [Value[], Value[]]

function getPairs(input: string): Pair[] {
  return input.split('\n\n').map(parsePair)
}

function parsePair(input: string): Pair {
  const [left, right] = input.split('\n').map(value => parseValue(eval(value))) as [Pair, Pair]

  return [left, right]
}

function parseValue(value: string | unknown[]): Value {
  if (Array.isArray(value)) {
    return value.map(parseValue)
  }

  return parseInt(value)
}

function checkPairOrder([left, right]: Pair): boolean | undefined {
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

function solve(): void {
  const pairs = getPairs(input)

  const sum = pairs.reduce((sum, pair, index) => {
    const result = checkPairOrder(pair)

    if (result ?? true) {
      return sum + index + 1
    }

    return sum
  }, 0)

  console.log(sum)
}

solve()