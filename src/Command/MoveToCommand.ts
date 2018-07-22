import { validateOptionWithName } from "./optionValidator"
import { projectXY } from "../helpers/point"
import { IPlugin } from "./IPlugin"

const MoveTo: IPlugin = {
  action: "moveTo",

  validateOptions: opts => {
    return validateOptionWithName(opts, ["x", "y"])
  },

  perform: (state, com) => {
    const [x, y] = com.options
    state.pos = projectXY(state.transform, x, y)
    return null
  }
}

export default MoveTo
