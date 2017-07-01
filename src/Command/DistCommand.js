import _ from "lodash"
import { Point } from "paper"
import { validateOptionWithName } from "./optionValidator"
import { InvalidStateError } from "../Error.js"

function range(num) {
  const arr = []
  for (let i = 0; i <= num; i++) {
    arr.push(i)
  }
  return arr
}

// start から end を繋ぐ線分を等分する num 個の点を返す
function dist(start, end, num) {
  return range(num - 1).map(i =>
    start.add(end.subtract(start).multiply(i / (num - 1))))
}

export default {
  action: "dist",

  validateOptions: (opts) => {
    return validateOptionWithName(opts, ["axis"])
  },

  perform: (state, com) => {
    const [ axis ] = com.options

    const shapes = state.targetShapes(com)

    if (shapes.length <= 1) {
      return InvalidStateError("two or more shapes needed")
    }

    switch(axis) {
      case "x": {
        const arr = shapes.map(s => s.bounds)
        const leftRect = _.minBy(arr, r => r.point.x)
        const rightRect = _.maxBy(arr, r => r.getRight())
        const list = dist(
          new Point(leftRect.center, 0),
          new Point(rightRect.center, 0),
          shapes.length)
        shapes
          .sort((a, b) => a.bounds.x > b.bounds.x)
          .forEach((shape, i) =>
            shape.pos.x += list[i].x - shape.bounds.centerX)
        break
      }
      case "y": {
        const arr = shapes.map(s => s.bounds)
        const topRect = _.minBy(arr, r => r.point.y)
        const bottomRect = _.maxBy(arr, r => r.getBottom())
        const list = dist(
          new Point(0, topRect.centerY),
          new Point(0, bottomRect.centerY),
          shapes.length)
        shapes
          .sort((a, b) => a.bounds.y > b.bounds.y)
          .forEach((shape, i) =>
            shape.pos.y += list[i].y - shape.bounds.centerY)
        break
      }
      default:
        break
    }
  }
}
