import { InvalidStateError } from "../Error"
import { IPlugin } from "./IPlugin"

const RemoveCommand: IPlugin = {
  action: "remove",

  perform: (state, com) => {
    const shapes = state.targetShapes(com)
    if (shapes.length === 0) {
      return InvalidStateError("no shapes to remove")
    }

    shapes.forEach(shape => state.removeShape(shape))
    return null
  }
}

export default RemoveCommand
