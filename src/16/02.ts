import { input } from '@/16/input'

const valves = new Map<string, Valve>()

class Valve {
  public id: string
  public flowRate: number
  public minutesOpen: number | null
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
    return (this.minutesOpen ?? 0) * this.flowRate
  }

  public get isClosed(): boolean {
    return this.minutesOpen === null
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

function getValveSequences(ids: string[], minutesRemaining: number, previousId: string = 'AA'): string[][] {
  if (!ids.length || minutesRemaining <= 0) {
    return [[]]
  }

  return ids.flatMap(id => {
    const distancesFromValve = distancesMap.get(previousId)
    const remainingValves = ids.filter(x => x !== id)
    const distanceToNextValve = distancesFromValve?.get(id) ?? 0
    const timeToOpenValve = 1

    return getValveSequences(remainingValves, minutesRemaining - timeToOpenValve - distanceToNextValve, id)
      .map(x => [id, ...x])
  })
}

function resetValves(): void {
  for (const [, valve] of valves) {
    valve.minutesOpen = null
  }
}

function calculateFlow(sequence: string[], minutesRemaining: number): number {
  resetValves()
  setValvesOpen(sequence, minutesRemaining)

  return sequence.reduce((sum, id) => sum += valves.get(id)!.totalFlowRate, 0)
}

function setValvesOpen(sequence: string[], minutesRemaining: number): void {
  const current = valves.get('AA')!

  const mySequence = sequence.filter((id, index) => index % 2 === 0)
  const elephantsSequence = sequence.filter((id, index) => index % 2 === 1)

  runSequence(current, mySequence, minutesRemaining)
  runSequence(current, elephantsSequence, minutesRemaining)
}

function runSequence(current: Valve, remainingSequence: string[], minutesRemaining: number): void {
  const nextStop = remainingSequence.shift()
  if (!nextStop) {
    return
  }

  const distancesFromValve = distancesMap.get(current.id)!
  const distanceToNextValve = distancesFromValve.get(nextStop)!
  if (minutesRemaining - 1 <= distanceToNextValve) {
    return
  }
  minutesRemaining -= distanceToNextValve

  const valve = valves.get(nextStop)!

  if (valve.flowRate > 0 && valve.isClosed) {
    minutesRemaining--
    valve.minutesOpen = minutesRemaining
  }

  if (minutesRemaining <= 0) {
    return
  }

  runSequence(valve, remainingSequence, minutesRemaining)
}

function solve(): void {
  const valveIds = Array.from(valves.values())
    .filter(valve => valve.flowRate > 0)
    .map(valve => valve.id)

  const minutesAvailable = 26
  const sequences = getValveSequences(valveIds, minutesAvailable)
  let maxFlowRate = 0
  for (const sequence of sequences) {
    const result = calculateFlow(sequence, minutesAvailable)

    if (result > maxFlowRate) {
      maxFlowRate = result
    }
  }

  console.log(maxFlowRate)
}

input.split('\n').map(input => new Valve(input))
const distancesMap = buildDistancesMap()
solve()