import { InvalidStateError } from "../Error.js"

export default {
  action: "edit",

  perform: (state, com) => {
    const shapes = state.targetShapes(com)

    if (shapes.length === 0) {
      return InvalidStateError("no shapes to edit")
    }
    shapes.forEach(shape => shape.editing = true)
  }
}
