import { validateOptionWithName } from "./optionValidator"
import { projectXY } from "../helpers/point"
import { IPlugin } from "./IPlugin"
import PathShape from "../Shape/PathShape"

const EllipticalArcCommand: IPlugin = {
  action: "ellipticalArc",

  validateOptions: opts => {
    return validateOptionWithName(opts, [
      "x",
      "y",
      "rx",
      "ry",
      "xAxisRotation",
      "largeArc",
      "sweep"
    ])
  },

  perform: (state, com) => {
    const { transform, currentShape } = state
    const [x, y, rx, ry, xAxisRotation, largeArc, sweep] = com.options

    state.preparePathShape()
    const p = projectXY(transform, x, y)
    const r = projectXY(transform, rx, ry)
    state.move(x, y)
    const shape = currentShape as PathShape
    shape.path.push({
      x: p.x,
      y: p.y,
      r,
      xAxisRotation: parseFloat(xAxisRotation),
      largeArc: parseFloat(largeArc),
      sweep: parseFloat(sweep),
      command: "elliptical arc",
      code: "A"
    })

    return null
  }
}

export default EllipticalArcCommand
