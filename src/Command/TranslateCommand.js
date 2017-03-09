import { validateOptionWithName } from "./optionValidator"
import { InvalidStateError } from "./Error.js"
import { project, pointAdd } from "../helpers/point"

export default {
  action: "translate",

  validateOptions: (opts) => {
    return validateOptionWithName(opts, ["x, y"])
  },

  perform: (state, com) => {
    const x = com.options[0]
    const y = com.options[1]

    const targetShapes = state.targetShapes(com)
    if (targetShapes.length === 0) {
      return InvalidStateError("no shapes to close path")
    }

    targetShapes.forEach(shape =>
      shape.pos = pointAdd(shape.pos, project(state.transform, { x, y })))
  }
}
