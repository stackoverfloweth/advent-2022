import { demo } from '@/17/input'

const valves = new Map<string, Valve>()

class Valve {
  public id: string
  public flowRate: number
  public minutesOpen: number
  private readonly connectionIds: string[]

  public constructor(input: string) {
    const regex = /Valve (..) has flow rate=(\d+); tunnel[s?]? lead[s?]? to valve[s]? (.+)$/g
    const matches = regex.exec(input)

    if (!matches) {
      throw 'invalid Valve input string'
    }

    const [, id, rate, connections] = matches

    this.id = id
    this.flowRate = parseInt(rate)
    this.connectionIds = connections.split(', ')

    valves.set(this.id, this)
  }

  public get connections(): Map<string, Valve> {
    const value = new Map<string, Valve>()

    for (const id of this.connectionIds) {
      const connection = valves.get(id)
      if (!connection) {
        throw 'invalid Valve id found in connections'
      }

      value.set(id, connection)
    }

    return value
  }

  public get totalFlowRate(): number {
    return this.minutesOpen * this.flowRate
  }
}

function getDistanceBetweenValves(current: Valve, destination: Valve, path: string[] = []): number {
  if (current.id === destination.id) {
    return path.length
  }

  path.push(current.id)

  let min = Infinity

  for (const [, connection] of current.connections) {
    if (path.includes(connection.id) || path.length > 30) {
      continue
    }

    const distance = getDistanceBetweenValves(connection, destination, [...path])

    if (distance < min) {
      min = distance
    }
  }

  return min
}

function getDistancesBetweenValves(target: Valve): Map<string, number> {
  const distances = new Map<string, number>()

  for (const [, valve] of valves) {
    if (valve.id !== target.id) {
      distances.set(valve.id, getDistanceBetweenValves(target, valve))
    }
  }

  return distances
}

function buildDistancesMap(): Map<string, Map<string, number>> {
  const distancesMap = new Map<string, Map<string, number>>()

  for (const [, valve] of valves) {
    distancesMap.set(valve.id, getDistancesBetweenValves(valve))
  }

  return distancesMap
}

function getAllPermutations(ids: string[], minutesRemaining: number): string[][] {
  if (!ids.length || minutesRemaining <= 0) {
    return [[]]
  }

  function openValve(valve: Valve): void {
    minutesRemaining--
    valve.minutesOpen = minutesRemaining
  }

  return ids.flatMap(id => {
    const distances = distancesMap.get(id)
    const remaining = ids.filter(x => x !== id)
    const [nextId] = remaining
    const nextValve = valves.get(nextId)

    if (nextValve && nextValve.flowRate > 0) {
      openValve(nextValve)
    }

    const distanceToNextValve = distances?.get(nextId) ?? 0

    return getAllPermutations(remaining, minutesRemaining - distanceToNextValve)
      .map(x => [id, ...x])
  })
}

function solve(): void {
  const valveIds = Array.from(valves.values()).map(valve => valve.id)
  const allPermutations = getAllPermutations(valveIds, 30)

  console.log(allPermutations.length)
}

demo.split('\n').map(input => new Valve(input))
const distancesMap = buildDistancesMap()
solve()