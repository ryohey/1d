import { Point } from "paper"
import { InvalidCommandError, InvalidStateError } from "../Error"
import { projectXY } from "../helpers/point"
import { IPlugin } from "./IPlugin"

const ResizeCommand: IPlugin = {
  action: "resize",

  validateOptions: opts => {
    if (opts.length < 2) {
      return InvalidCommandError("insufficient parameters")
    }
    return null
  },

  perform: (state, com) => {
    const [x, y, anchorX = "0.5", anchorY = "0.5"] = com.options
    const anchor = new Point(parseFloat(anchorX), parseFloat(anchorY))
    const { transform } = state
    const p = projectXY(transform, x, y)

    const targetShapes = state.targetShapes(com)
    if (targetShapes.length === 0) {
      return InvalidStateError("no shapes to resize")
    }

    targetShapes.forEach(shape => shape.resize(p, anchor))

    return null
  }
}

export default ResizeCommand
