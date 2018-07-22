import { validateOptionWithName } from "./optionValidator"
import { InvalidStateError } from "../Error"
import TextShape from "../Shape/TextShape"
import { IPlugin } from "./IPlugin"

const FontFamiliyCommand: IPlugin = {
  action: "fontFamily",

  validateOptions: opts => {
    return validateOptionWithName(opts, ["fontFamily"])
  },

  perform: (state, com) => {
    const [fontFamily] = com.options

    const shapes = state.targetShapes(com)
    if (shapes.length === 0) {
      return InvalidStateError("no shapes to change font size")
    }

    for (const shape of shapes) {
      if (!(shape instanceof TextShape)) {
        return InvalidStateError("the shape is not TextShape")
      }
      const textShape = shape as TextShape
      textShape.fontFamily = fontFamily
    }

    return null
  }
}

export default FontFamiliyCommand
