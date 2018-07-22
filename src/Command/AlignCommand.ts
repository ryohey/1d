import _ from "lodash"
import { validateOptionWithName } from "./optionValidator"
import { InvalidStateError, InvalidCommandError } from "../Error"
import { IPlugin } from "./IPlugin"
import { strictMin, strictMax } from "../basic/arrayHelper"

const AlignCommand: IPlugin = {
  action: "align",

  validateOptions: opts => {
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
        const y = strictMin(shapes.map(s => s.bounds.y))
        shapes.forEach(s => (s.pos.y += y - s.bounds.y))
        break
      }

      case "bottom":
      case "b": {
        const bottom = strictMax(shapes.map(s => s.bounds.bottom))
        shapes.forEach(s => (s.pos.y += bottom - s.bounds.bottom))
        break
      }

      case "left":
      case "l": {
        const x = strictMin(shapes.map(s => s.bounds.x))
        shapes.forEach(s => (s.pos.x += x - s.bounds.x))
        break
      }

      case "right":
      case "r": {
        const right = strictMax(shapes.map(s => s.bounds.right))
        shapes.forEach(s => (s.pos.x += right - s.bounds.right))
        break
      }

      case "center":
      case "c":
      case "x": {
        const center = _.sum(shapes.map(s => s.bounds.center.x)) / shapes.length
        shapes.forEach(s => (s.pos.x += center - s.bounds.center.x))
        break
      }

      case "middle":
      case "m":
      case "y": {
        const middle = _.sum(shapes.map(s => s.bounds.center.y)) / shapes.length
        shapes.forEach(s => (s.pos.y += middle - s.bounds.center.y))
        break
      }

      default:
        return InvalidCommandError(`unknown type: ${type}`)
    }

    return null
  }
}

export default AlignCommand
