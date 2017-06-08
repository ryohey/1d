import _ from "lodash"
import { InvalidStateError } from "../Error.js"

export default {
  action: "sendToBack",

  perform: (state, com) => {
    const shapes = state.targetShapes(com)

    if (shapes.length === 0) {
      return InvalidStateError("no shapes to send to back")
    }

    const minZIndex = _.min(state.shapes.map(s => s.zIndex || 0))
    const zIndex = minZIndex - 1

    shapes.forEach(shape =>
      shape.zIndex = zIndex)
  }
}
