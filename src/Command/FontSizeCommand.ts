import { validateOptionWithName } from "./optionValidator"
import { InvalidStateError } from "../Error"
import { project } from "../helpers/point"
import TextShape from "../Shape/TextShape"
import { IPlugin } from "./IPlugin"

const FontSizeCommand: IPlugin = {
  action: "fontSize",

  validateOptions: opts => {
    return validateOptionWithName(opts, ["fontSize"])
  },

  perform: (state, com) => {
    const [fontSize] = com.options
    const { transform } = state

    const shapes = state.targetShapes(com)
    if (shapes.length === 0) {
      return InvalidStateError("no shapes to change font size")
    }

    for (const shape of shapes) {
      if (!(shape instanceof TextShape)) {
        return InvalidStateError("the shape is not TextShape")
      }
      shape.fontSize = project(transform, fontSize)
    }

    return null
  }
}

export default FontSizeCommand
