import { InvalidStateError } from "../Error"
import { IPlugin } from "./IPlugin"
import { strictMin } from "../basic/arrayHelper"

const SendToBackCommand: IPlugin = {
  action: "sendToBack",

  perform: (state, com) => {
    const shapes = state.targetShapes(com)

    if (shapes.length === 0) {
      return InvalidStateError("no shapes to send to back")
    }

    const minZIndex = strictMin(state.shapes.map(s => s.zIndex || 0))
    const zIndex = minZIndex - 1

    shapes.forEach(shape => (shape.zIndex = zIndex))

    return null
  }
}

export default SendToBackCommand
