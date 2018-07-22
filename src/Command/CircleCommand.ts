import _ from "lodash"
import { Point } from "paper"
import { InvalidCommandError } from "../Error"
import { project } from "../helpers/point"
import CircleShape from "../Shape/CircleShape"
import { IPlugin } from "./IPlugin"

const CircleCommand: IPlugin = {
  action: "circle",

  validateOptions: opts => {
    if (opts.length === 0) {
      return InvalidCommandError("rx not specified")
    }
    return null
  },

  perform: (state, com) => {
    const opts = com.options
    const rx = project(state.transform, opts[0])
    const radius = new Point(rx, rx)
    if (!_.isNil(opts[1])) {
      radius.x = project(state.transform, opts[1])
    }
    state.addShape(new CircleShape(state.pos, radius))
    return null
  }
}

export default CircleCommand
