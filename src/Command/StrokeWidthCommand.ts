import { validateOptionWithName } from "./optionValidator"
import { InvalidStateError } from "../Error"
import { project } from "../helpers/point"
import { IPlugin } from "./IPlugin"

const StrokeWidthCommand: IPlugin = {
  action: "strokeWidth",

  validateOptions: opts => {
    return validateOptionWithName(opts, ["strokeWidth"])
  },

  perform: (state, com) => {
    const [strokeWidth] = com.options
    const targetShapes = state.targetShapes(com)
    const { transform } = state

    if (targetShapes.length === 0) {
      return InvalidStateError("no shapes to apply translateTo")
    }

    targetShapes.forEach(
      shape => (shape.brush.strokeWidth = project(transform, strokeWidth))
    )

    return null
  }
}

export default StrokeWidthCommand
