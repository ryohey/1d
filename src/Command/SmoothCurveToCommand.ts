import { validateOptionWithName } from "./optionValidator"
import { projectXY } from "../helpers/point"
import { IPlugin } from "./IPlugin"
import PathShape from "../Shape/PathShape"

const SmoothCurveToCommand: IPlugin = {
  action: "smoothCurveTo",

  validateOptions: opts => {
    return validateOptionWithName(opts, ["x", "y", "x1", "y1"])
  },

  perform: (state, com) => {
    const { transform, currentShape } = state
    const [x, y, x1, y1] = com.options

    state.preparePathShape()
    const p = projectXY(transform, x, y)
    const c = projectXY(transform, x1, y1)
    state.move(x, y)
    const shape = currentShape as PathShape
    shape.path.push({
      x: p.x,
      y: p.y,
      c,
      command: "smooth curveto",
      code: "S"
    })

    return null
  }
}

export default SmoothCurveToCommand
