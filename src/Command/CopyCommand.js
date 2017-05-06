import { InvalidStateError } from "../Error.js"
import { pointCopy } from "../helpers/point"

export default {
  action: "copy",

  validateOptions: (opts) => {
    return null
  },

  perform: (state, com) => {
    const { selectedShapes } = state
    if (selectedShapes.length === 0) {
      return InvalidStateError("invalid state: no shapes to copy")
    }
    selectedShapes.forEach(shape => {
      const newShape = shape.clone()
      newShape.pos = pointCopy(state.pos)
      state.addShape(newShape)
    })
  }
}
