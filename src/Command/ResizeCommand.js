import { Point } from "paper"
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
    const anchor = new Point(anchorX, anchorY)
    const { transform } = state
    const p = project(transform, { x, y })

    const targetShapes = state.targetShapes(com)
    if (targetShapes.length === 0) {
      return InvalidStateError("no shapes to resize")
    }

    targetShapes.forEach(shape =>
      shape.resize(new Point(p), anchor))
  }
}
