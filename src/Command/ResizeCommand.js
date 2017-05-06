import { InvalidCommandError, InvalidStateError } from "../Error.js"
import { project } from "../helpers/point"

export default {
  action: "resize",

  validateOptions: (opts) => {
    if (opts.length < 2) {
      return InvalidCommandError("insufficient parameters")
    }
  },

  perform: (state, com) => {
    const [x, y, anchorX = 0.5, anchorY = 0.5] = com.options
    const anchor = { x: anchorX, y: anchorY }
    const { transform } = state

    const targetShapes = state.targetShapes(com)
    if (targetShapes.length === 0) {
      return InvalidStateError("no shapes to resize")
    }

    targetShapes.forEach(shape =>
      shape.resize(project(transform, { x, y }), anchor))
  }
}
