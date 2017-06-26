import { InvalidStateError } from "../Error.js"

export default {
  action: "copy",

  perform: (state, com) => {
    const { selectedShapes } = state
    if (selectedShapes.length === 0) {
      return InvalidStateError("invalid state: no shapes to copy")
    }
    selectedShapes.forEach(shape => {
      const newShape = shape.clone()
      newShape.pos = state.pos.clone()
      state.addShape(newShape)
    })
  }
}
