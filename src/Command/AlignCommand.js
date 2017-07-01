import _ from "lodash"
import { validateOptionWithName } from "./optionValidator"
import { InvalidStateError, InvalidCommandError } from "../Error.js"

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
        const y = _.min(shapes.map(s => s.bounds.y))
        shapes.forEach(s => s.pos.y += y - s.bounds.y)
        break
      }

      case "bottom":
      case "b": {
        const bottom = _.max(shapes.map(s => s.bounds.bottom))
        shapes.forEach(s => s.pos.y += bottom - s.bounds.bottom)
        break
      }

      case "left":
      case "l": {
        const x = _.min(shapes.map(s => s.bounds.x))
        shapes.forEach(s => s.pos.x += x - s.bounds.x)
        break
      }

      case "right":
      case "r": {
        const right = _.max(shapes.map(s => s.bounds.right))
        shapes.forEach(s => s.pos.x += right - s.bounds.right)
        break
      }

      case "center":
      case "c":
      case "x": {
        const center = _.sum(shapes.map(s => s.bounds.centerX)) / shapes.length
        shapes.forEach(s => s.pos.x += center - s.bounds.centerX)
        break
      }

      case "middle":
      case "m":
      case "y": {
        const middle = _.sum(shapes.map(s => s.bounds.centerY)) / shapes.length
        shapes.forEach(s => s.pos.y += middle - s.bounds.centerY)
        break
      }

      default:
        return InvalidCommandError(`unknown type: ${type}`)
    }
  }
}
