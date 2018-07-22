import { validateOptionWithName } from "./optionValidator"
import { projectXY } from "../helpers/point"
import { IPlugin } from "./IPlugin"

const LineToCommand: IPlugin = {
  action: "lineTo",

  validateOptions: opts => {
    return validateOptionWithName(opts, ["x", "y"])
  },

  perform: (state, com) => {
    const [x, y] = com.options
    state.preparePathShape()
    state.pos = projectXY(state.transform, x, y)
    state.addPosToCurrentShapePath()
    return null
  }
}

export default LineToCommand
