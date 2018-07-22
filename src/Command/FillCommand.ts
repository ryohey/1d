import { validateOptionWithName } from "./optionValidator"
import { InvalidStateError } from "../Error"
import { IPlugin } from "./IPlugin"

const FillCommand: IPlugin = {
  action: "fill",

  validateOptions: opts => {
    return validateOptionWithName(opts, ["fillColor"])
  },

  perform: (state, com) => {
    const [fillColor] = com.options

    const targetShapes = state.targetShapes(com)

    if (targetShapes.length === 0) {
      return InvalidStateError("no shapes to change fill color")
    }

    targetShapes.forEach(shape => (shape.brush.fill = fillColor))

    return null
  }
}

export default FillCommand
