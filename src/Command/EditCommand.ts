import { InvalidStateError } from "../Error"
import { IPlugin } from "./IPlugin"

const EditCommand: IPlugin = {
  action: "edit",

  perform: (state, com) => {
    const shapes = state.targetShapes(com)

    if (shapes.length === 0) {
      return InvalidStateError("no shapes to edit")
    }
    shapes.forEach(shape => (shape.editing = true))

    return null
  }
}

export default EditCommand
