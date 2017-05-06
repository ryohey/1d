import { InvalidStateError } from "../Error.js"
import PathShape from "../Shape/PathShape"

export default {
  action: "close",

  validateOptions: () => null,

  perform: (state, com) => {
    const target = state.findShape(com.target)
    const targetShapes = target ? [target] : state.currentShapes
    if (targetShapes.length === 0) {
      return InvalidStateError("no shapes to close path")
    }

    const shape = targetShapes[0]
    if (!(shape instanceof PathShape)) {
      return InvalidStateError("the shape is not PathShape")
    }

    shape.closed = true
  }
}
