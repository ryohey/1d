import { validateOptionWithName } from "./optionValidator"
import { InvalidStateError } from "./Error.js"
import { project } from "../helpers/point"

export default {
  action: "strokeWidth",

  validateOptions: (opts) => {
    return validateOptionWithName(opts, ["strokeWidth"])
  },

  perform: (state, com) => {
    const [strokeWidth] = com.options
    const targetShapes = state.targetShapes(com)
    const { transform } = state

    if (targetShapes.length === 0) {
      return InvalidStateError("no shapes to apply translateTo")
    }

    targetShapes.forEach(shape =>
      shape.brush.strokeWidth = project(transform, strokeWidth))
  }
}
