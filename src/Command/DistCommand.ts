import _ from "lodash"
import { Point } from "paper"
import { validateOptionWithName } from "./optionValidator"
import { InvalidStateError } from "../Error"
import { IPlugin } from "./IPlugin"

function range(num: number): number[] {
  const arr: number[] = []
  for (let i = 0; i <= num; i++) {
    arr.push(i)
  }
  return arr
}

// start から end を繋ぐ線分を等分する num 個の点を返す
function dist(start, end, num) {
  return range(num - 1).map(i =>
    start.add(end.subtract(start).multiply(i / (num - 1)))
  )
}

const DistCommand: IPlugin = {
  action: "dist",

  validateOptions: opts => {
    return validateOptionWithName(opts, ["axis"])
  },

  perform: (state, com) => {
    const [axis] = com.options

    const shapes = state.targetShapes(com)

    if (shapes.length <= 1) {
      return InvalidStateError("two or more shapes needed")
    }

    switch (axis) {
      case "x": {
        const arr = shapes.map(s => s.bounds)
        const leftRect = _.minBy(arr, r => r.point.x)
        const rightRect = _.maxBy(arr, r => r.right)
        if (leftRect === undefined || rightRect === undefined) {
          break
        }
        const list = dist(
          new Point(leftRect.center.x, 0),
          new Point(rightRect.center.x, 0),
          shapes.length
        )
        shapes
          .sort((a, b) => a.bounds.x - b.bounds.x)
          .forEach(
            (shape, i) => (shape.pos.x += list[i].x - shape.bounds.center.x)
          )
        break
      }
      case "y": {
        const arr = shapes.map(s => s.bounds)
        const topRect = _.minBy(arr, r => r.point.y)
        const bottomRect = _.maxBy(arr, r => r.bottom)
        if (topRect === undefined || bottomRect === undefined) {
          break
        }
        const list = dist(
          new Point(0, topRect.center.y),
          new Point(0, bottomRect.center.y),
          shapes.length
        )
        shapes
          .sort((a, b) => a.bounds.y - b.bounds.y)
          .forEach(
            (shape, i) => (shape.pos.y += list[i].y - shape.bounds.center.y)
          )
        break
      }
      default:
        break
    }

    return null
  }
}

export default DistCommand
