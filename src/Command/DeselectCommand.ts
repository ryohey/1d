import { validateOptionWithName } from "./optionValidator"
import { InvalidStateError } from "../Error"
import { IPlugin } from "./IPlugin"

const DeselectCommand: IPlugin = {
  action: "deselect",

  validateOptions: opts => {
    return validateOptionWithName(opts, ["target"])
  },

  perform: (state, com) => {
    const shapes = state.targetShapes(com)
    if (shapes.length === 0) {
      return InvalidStateError("no shapes to close path")
    }

    shapes.forEach(shape => (shape.selected = false))
    return null
  }
}

export default DeselectCommand
