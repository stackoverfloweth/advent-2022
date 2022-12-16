import { input } from '@/15/input'

type Position = [x: number, y: number]
type Sensor = {
  position: Position,
  nearestBeacon: Position,
  distanceToBeacon: number,
}

class BeaconMap {
  public readonly sensors = new Map<string, Sensor>()

  public registerSensor(position: Position, nearestBeacon: Position): void {
    const distanceToBeacon = this.getDistance(position, nearestBeacon)

    this.sensors.set(this.getPositionKey(position), {
      position,
      nearestBeacon,
      distanceToBeacon,
    })
  }

  public isWithinBoundsOfAnySensor(position: Position): boolean {
    for (const [, sensor] of this.sensors) {
      const sensorDistance = this.getDistance(position, sensor.position)

      if (sensorDistance <= sensor.distanceToBeacon) {
        return true
      }
    }

    return false
  }

  private getDistance([x1, y1]: Position, [x2, y2]: Position): number {
    return Math.abs(x2 - x1) + Math.abs(y2 - y1)
  }

  private getPositionKey([x, y]: Position): string {
    return `${x}:${y}`
  }
}

function getPerimeterOfSensor(sensor: Sensor): Position[] {
  const perimeter: Position[] = []
  let [x, y] = sensor.position
  x -= sensor.distanceToBeacon + 1

  for (let index = 0; index <= sensor.distanceToBeacon + 1; index++) {
    x += 1
    y += 1
    perimeter.push([x, y])
  }

  for (let index = 0; index <= sensor.distanceToBeacon + 1; index++) {
    x += 1
    y -= 1
    perimeter.push([x, y])
  }

  for (let index = 0; index <= sensor.distanceToBeacon + 1; index++) {
    x -= 1
    y -= 1
    perimeter.push([x, y])
  }

  for (let index = 0; index <= sensor.distanceToBeacon + 1; index++) {
    x -= 1
    y += 1
    perimeter.push([x, y])
  }

  return perimeter.filter(isInRange)
}

function isInRange([x, y]: Position): boolean {
  if (x < 0 || y < 0) {
    return false
  }

  if (x > 4000000 || y > 4000000) {
    return false
  }

  return true
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

function solve(input: string): void {
  const map = buildBeaconMap(input)

  for (const [, sensor] of map.sensors) {
    const perimeter = getPerimeterOfSensor(sensor)
    for (const position of perimeter) {
      if (!map.isWithinBoundsOfAnySensor(position)) {
        const [x, y] = position
        throw x * 4000000 + y
      }
    }
  }

}

solve(input)
