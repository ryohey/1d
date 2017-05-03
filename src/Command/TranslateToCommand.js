import { validateOptionWithName } from "./optionValidator"
import { InvalidStateError } from "./Error.js"
import { project, pointAdd } from "../helpers/point"

export default {
  action: "translateTo",

  validateOptions: (opts) => {
    return validateOptionWithName(opts, ["x", "y"])
  },

  perform: (state, com) => {
    const [x, y] = com.options
    const targetShapes = state.targetShapes(com)

    if (targetShapes.length === 0) {
      return InvalidStateError("no shapes to apply translateTo")
    }

    targetShapes.forEach(shape =>
      state.translateTo(shape, x, y))
  }
}
