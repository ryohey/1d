import { validateOptionWithName } from "./optionValidator"
import { InvalidStateError } from "../Error"
import { projectXY } from "../helpers/point"
import { IPlugin } from "./IPlugin"

function translateTo(shape, transform, x, y) {
  shape.pos = projectXY(transform, x, y)
}

const TranslateToCommand: IPlugin = {
  action: "translateTo",

  validateOptions: opts => {
    return validateOptionWithName(opts, ["x", "y"])
  },

  perform: (state, com) => {
    const [x, y] = com.options
    const { transform } = state
    const targetShapes = state.targetShapes(com)

    if (targetShapes.length === 0) {
      return InvalidStateError("no shapes to apply translateTo")
    }

    targetShapes.forEach(shape => translateTo(shape, transform, x, y))

    return null
  }
}

export default TranslateToCommand
