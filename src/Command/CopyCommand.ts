import { InvalidStateError } from "../Error"
import { IPlugin } from "./IPlugin"

const CopyCommand: IPlugin = {
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
    return null
  }
}

export default CopyCommand
