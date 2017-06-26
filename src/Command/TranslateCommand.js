import { validateOptionWithName } from "./optionValidator"
import { InvalidStateError } from "../Error.js"
import { project } from "../helpers/point"

export default {
  action: "translate",

  validateOptions: (opts) => {
    return validateOptionWithName(opts, ["x", "y"])
  },

  perform: (state, com) => {
    const [x, y] = com.options

    const targetShapes = state.targetShapes(com)
    if (targetShapes.length === 0) {
      return InvalidStateError("no shapes to translate")
    }

    targetShapes.forEach(shape =>
      shape.pos = shape.pos.add(project(state.transform, { x, y })))
  }
}
