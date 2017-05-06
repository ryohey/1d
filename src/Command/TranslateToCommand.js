import { validateOptionWithName } from "./optionValidator"
import { InvalidStateError } from "../Error.js"
import { project } from "../helpers/point"

function translateTo(shape, transform, x, y) {
  shape.pos = project(transform, { x, y })
}

export default {
  action: "translateTo",

  validateOptions: (opts) => {
    return validateOptionWithName(opts, ["x", "y"])
  },

  perform: (state, com) => {
    const [ x, y ] = com.options
    const { transform } = state
    const targetShapes = state.targetShapes(com)

    if (targetShapes.length === 0) {
      return InvalidStateError("no shapes to apply translateTo")
    }

    targetShapes.forEach(shape =>
      translateTo(shape, transform, x, y))
  }
}
