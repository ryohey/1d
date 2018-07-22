import { InvalidStateError } from "../Error"
import PathShape from "../Shape/PathShape"
import { IPlugin } from "./IPlugin"

const CloseCommand: IPlugin = {
  action: "close",

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
    return null
  }
}

export default CloseCommand
