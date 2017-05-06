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
        const top = _.min(shapes.map(s => s.pos.y))
        shapes.forEach(s => s.pos.y = top)
        break
      }

      case "bottom":
      case "b": {
        const bottom = _.max(shapes.map(s => s.pos.y + s.size.y))
        shapes.forEach(s => s.pos.y = bottom - s.size.y)
        break
      }

      case "left":
      case "l": {
        const left = _.min(shapes.map(s => s.pos.x))
        shapes.forEach(s => s.pos.x = left)
        break
      }

      case "right":
      case "r": {
        const right = _.max(shapes.map(s => s.pos.x + s.size.x))
        shapes.forEach(s => s.pos.x = right - s.size.x)
        break
      }

      case "center":
      case "c":
      case "x": {
        const x = _.sum(shapes.map(s => s.pos.x)) / shapes.length
        shapes.forEach(s => s.pos.x = x)
        break
      }

      case "middle":
      case "m":
      case "y": {
        const y = _.sum(shapes.map(s => s.pos.y)) / shapes.length
        shapes.forEach(s => s.pos.y = y)
        break
      }

      default:
        return InvalidCommandError(`unknown type: ${type}`)
    }
  }
}
