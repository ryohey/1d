import { validateOptionWithName } from "./optionValidator"
import { InvalidStateError } from "../Error"
import { projectXY } from "../helpers/point"
import { IPlugin } from "./IPlugin"

const TranslateCommand: IPlugin = {
  action: "translate",

  validateOptions: opts => {
    return validateOptionWithName(opts, ["x", "y"])
  },

  perform: (state, com) => {
    const [x, y] = com.options

    const targetShapes = state.targetShapes(com)
    if (targetShapes.length === 0) {
      return InvalidStateError("no shapes to translate")
    }

    targetShapes.forEach(
      shape => (shape.pos = shape.pos.add(projectXY(state.transform, x, y)))
    )

    return null
  }
}

export default TranslateCommand
