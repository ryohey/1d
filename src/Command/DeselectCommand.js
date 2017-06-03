import { validateOptionWithName } from "./optionValidator"
import { InvalidStateError } from "../Error.js"

export default {
  action: "deselect",

  validateOptions: (opts) => {
    return validateOptionWithName(opts, ["target"])
  },

  perform: (state, com) => {
    const shapes = state.targetShapes(com)
    if (shapes.length === 0) {
      return InvalidStateError("no shapes to close path")
    }

    shapes.forEach(shape =>
      shape.selected = false)
  }
}
