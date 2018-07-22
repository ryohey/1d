import { Point } from "paper"
import { validateOptionWithName } from "./optionValidator"
import GridShape from "../Shape/GridShape"
import { IPlugin } from "./IPlugin"

const GridCommand: IPlugin = {
  action: "grid",

  validateOptions: opts => {
    return validateOptionWithName(opts, ["scale"])
  },

  perform: (state, com) => {
    const { transform } = state
    const scale = parseFloat(com.options[0])
    state.addShape(new GridShape(new Point(0, 0), scale))
    transform.scale = scale
    return null
  }
}

export default GridCommand
