import _ from "lodash"
import { validateOptionWithName } from "./optionValidator"
import { InvalidStateError, InvalidCommandError } from "../Error.js"
import { getRectCenter, getRectMiddle, getRectRight, getRectBottom } from "../helpers/rect"

export default {
  action: "align",

  validateOptions: (opts) => {
    return validateOptionWithName(opts, ["type"])
  },

  perform: (state, com) => {
    const [type] = com.options

    const shapes = state.targetShapes(com)
    if (shapes.length === 0) {
      return InvalidStateError("no shapes to close path")
    }

    switch (type) {
      case "top":
      case "t": {
        const y = _.min(shapes.map(s => s.origin.y))
        shapes.forEach(s => s.originY = y)
        break
      }

      case "bottom":
      case "b": {
        const bottom = _.max(shapes.map(s => getRectBottom(s.bounds)))
        shapes.forEach(s =>
          s.originY = bottom - s.size.y)
        break
      }

      case "left":
      case "l": {
        const x = _.min(shapes.map(s => s.origin.x))
        shapes.forEach(s => s.originX = x)
        break
      }

      case "right":
      case "r": {
        const right = _.max(shapes.map(s => getRectRight(s.bounds)))
        shapes.forEach(s =>
          s.originX = right - s.size.x)
        break
      }

      case "center":
      case "c":
      case "x": {
        const center = _.sum(shapes.map(s => getRectCenter(s.bounds))) / shapes.length
        shapes.forEach(s =>
          s.originX = center - s.size.x / 2)
        break
      }

      case "middle":
      case "m":
      case "y": {
        const middle = _.sum(shapes.map(s => getRectMiddle(s.bounds))) / shapes.length
        shapes.forEach(s =>
          s.originY = middle - s.size.y / 2)
        break
      }

      default:
        return InvalidCommandError(`unknown type: ${type}`)
    }
  }
}
