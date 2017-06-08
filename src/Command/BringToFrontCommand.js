import _ from "lodash"
import { InvalidStateError } from "../Error.js"

export default {
  action: "bringToFront",

  perform: (state, com) => {
    const shapes = state.targetShapes(com)

    if (shapes.length === 0) {
      return InvalidStateError("no shapes to bring to front")
    }

    const maxZIndex = _.max(state.shapes.map(s => s.zIndex || 0))
    const zIndex = maxZIndex + 1

    shapes.forEach(shape =>
      shape.zIndex = zIndex)
  }
}
