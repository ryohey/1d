import { validateOptionWithName } from "./optionValidator"
import { IPlugin } from "./IPlugin"

const LineCommand: IPlugin = {
  action: "line",

  validateOptions: opts => {
    return validateOptionWithName(opts, ["x", "y"])
  },

  perform: (state, com) => {
    state.preparePathShape()
    state.move(com.options[0], com.options[1])
    state.addPosToCurrentShapePath()
    return null
  }
}

export default LineCommand
