import { InvalidCommandError } from "./Error.js"
import { InvalidStateError } from "./Error.js"
import { project, pointAdd } from "../helpers/point"

export default {
  action: "resize",

  validateOptions: (opts) => {
    if (opts.length < 2) {
      return InvalidCommandError("insufficient parameters")
    }
  },

  perform: (state, com) => {
    const [x, y, anchorX, anchorY] = com.options

    const targetShapes = state.targetShapes(com)
    if (targetShapes.length === 0) {
      return InvalidStateError("no shapes to resize")
    }

    targetShapes.forEach(shape =>
      state.resize(shape, x, y, anchorX, anchorY))
  }
}
