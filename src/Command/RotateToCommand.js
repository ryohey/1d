import { validateOptionWithName } from "./optionValidator"
import { InvalidStateError } from "../Error.js"

export default {
  action: "rotateTo",

  validateOptions: (opts) => {
    return validateOptionWithName(opts, ["angle"])
  },

  perform: (state, com) => {
    const [ _angle ] = com.options
    const angle = parseFloat(_angle)
    const shapes = state.targetShapes(com)

    if (shapes.length === 0) {
      return InvalidStateError("no shapes to apply translateTo")
    }

    shapes.forEach(shape =>
      shape.rotation = angle)
  }
}
