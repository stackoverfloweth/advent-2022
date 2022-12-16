import { input } from '@/15/input'

type Position = [x: number, y: number]
type Sensor = {
  position: Position,
  nearestBeacon: Position,
  distanceToBeacon: number,
}

class BeaconMap {
  private readonly sensors = new Map<string, Sensor>()
  private readonly beacons = new Map<string, Position>()
  public minX = Infinity
  public maxX = 0

  public registerSensor(position: Position, nearestBeacon: Position): void {
    const distanceToBeacon = this.getDistance(position, nearestBeacon)

    this.checkMinMax(position)
    this.checkMinMax(nearestBeacon)

    this.sensors.set(this.getPositionKey(position), {
      position,
      nearestBeacon,
      distanceToBeacon,
    })
    this.beacons.set(this.getPositionKey(nearestBeacon), nearestBeacon)
  }

  public isBeacon(position: Position): boolean {
    const key = this.getPositionKey(position)

    return this.beacons.has(key)
  }

  public isBetweenAnySensorAndBeacon(position: Position): boolean {
    for (const [, sensor] of this.sensors) {
      const sensorDistance = this.getDistance(position, sensor.position)

      if (sensorDistance <= sensor.distanceToBeacon) {
        return true
      }
    }

    return false
  }

  private checkMinMax([x]: Position): void {
    if (x < this.minX) {
      this.minX = x
    }

    if (x > this.maxX) {
      this.maxX = x
    }
  }

  private getDistance([x1, y1]: Position, [x2, y2]: Position): number {
    return Math.abs(x2 - x1) + Math.abs(y2 - y1)
  }

  private getPositionKey([x, y]: Position): string {
    return `${x}:${y}`
  }
}

function buildBeaconMap(value: string): BeaconMap {
  const map = new BeaconMap()

  for (const data of value.split('\n')) {
    const regex = /Sensor at x=(.+), y=(.+): closest beacon is at x=(.+), y=(.+)$/g
    const matches = regex.exec(data)

    if (!matches) {
      throw 'invalid input'
    }

    const [, sensorX, sensorY, beaconX, beaconY] = matches.map(Number)

    map.registerSensor([sensorX, sensorY], [beaconX, beaconY])
  }

  return map
}

function solve(input: string, yAxis: number): void {
  const map = buildBeaconMap(input)

  let definitelyNotABeacon = 0
  const y = yAxis
  for (let x = map.minX - 10000000; x <= map.maxX + 10000000; x++) {
    const position: Position = [x, y]

    if (map.isBeacon(position)) {
      continue
    }

    if (map.isBetweenAnySensorAndBeacon(position)) {
      definitelyNotABeacon++
    }
  }

  console.log(definitelyNotABeacon)
}

// solve(demo, 10)
solve(input, 2000000)