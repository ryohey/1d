import { InvalidStateError } from "../Error"
import { IPlugin } from "./IPlugin"
import { strictMax } from "../basic/arrayHelper"

const BringToFrontCommand: IPlugin = {
  action: "bringToFront",

  perform: (state, com) => {
    const shapes = state.targetShapes(com)

    if (shapes.length === 0) {
      return InvalidStateError("no shapes to bring to front")
    }

    const maxZIndex = strictMax(state.shapes.map(s => s.zIndex || 0))
    const zIndex = maxZIndex + 1

    shapes.forEach(shape => (shape.zIndex = zIndex))

    return null
  }
}

export default BringToFrontCommand
