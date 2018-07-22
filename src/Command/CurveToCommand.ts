import { validateOptionWithName } from "./optionValidator"
import { projectXY } from "../helpers/point"
import { IPlugin } from "./IPlugin"
import PathShape from "../Shape/PathShape"

const CurveToCommand: IPlugin = {
  action: "curveTo",

  validateOptions: opts => {
    return validateOptionWithName(opts, ["x", "y", "x1", "y1", "x2", "y2"])
  },

  perform: (state, com) => {
    const { transform } = state
    const [x, y, x1, y1, x2, y2] = com.options
    state.preparePathShape()
    const p = projectXY(transform, x, y)
    const c1 = projectXY(transform, x1, y1)
    const c2 = projectXY(transform, x2, y2)
    state.pos = p
    const shape = state.currentShape as PathShape
    shape.path.push({
      x: p.x,
      y: p.y,
      c1: c1.add(p),
      c2: c2.add(p),
      command: "curveto",
      code: "C"
    })
    return null
  }
}

export default CurveToCommand
