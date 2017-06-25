import _ from "lodash"
import { Point } from "paper"
import { validateOptionWithName } from "./optionValidator"
import { InvalidStateError } from "../Error.js"
import { getRectCenter, getRectBottom, getRectRight, getRectMiddle } from "../helpers/rect"

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
        const leftRect = _.minBy(arr, b => b.origin.x)
        const rightRect = _.maxBy(arr, getRectRight)
        const list = dist(
          new Point(getRectCenter(leftRect), 0),
          new Point(getRectCenter(rightRect), 0),
          shapes.length)
        shapes
          .sort((a, b) => a.origin.x > b.origin.x)
          .forEach((shape, i) =>
            shape.originX = list[i].x - shape.size.x / 2)
        break
      }
      case "y": {
        const arr = shapes.map(s => s.bounds)
        const topRect = _.minBy(arr, b => b.origin.y)
        const bottomRect = _.maxBy(arr, getRectBottom)
        const list = dist(
          new Point(0, getRectMiddle(topRect)),
          new Point(0, getRectMiddle(bottomRect)),
          shapes.length)
        shapes
          .sort((a, b) => a.origin.y > b.origin.y)
          .forEach((shape, i) =>
            shape.originY = list[i].y - shape.size.y / 2)
        break
      }
      default:
        break
    }
  }
}
