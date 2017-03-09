import { validateOptionWithName } from "./optionValidator"
import { InvalidStateError } from "./Error.js"

export default {
  action: "stroke",

  validateOptions: (opts) => {
    return validateOptionWithName(opts, ["color"])
  },

  perform: (state, com) => {
    const targetShapes = state.targetShapes(com)
    if (targetShapes.length === 0) {
      return InvalidStateError("no shapes to close path")
    }

    targetShapes.forEach(shape =>
      shape.brush.stroke = com.options[0])
  }
}
