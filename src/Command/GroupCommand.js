import { InvalidStateError } from "../Error"

export default {
  action: "group",

  perform: (state, com) => {
    const shapes = state.targetShapes(com)
    if (shapes.length === 0) {
      return InvalidStateError("no shapes to create a group")
    }

    state.createGroup(shapes)
  }
}
