import _ from "lodash"
import { Point } from "paper"
import { InvalidCommandError } from "../Error.js"
import { project } from "../helpers/point"
import CircleShape from "../Shape/CircleShape"

export default {
  action: "circle",

  validateOptions: (opts) => {
    if (opts.length === 0) {
      return InvalidCommandError("rx not specified")
    }
  },

  perform: (state, com) => {
    const opts = com.options
    const rx = project(state.transform, opts[0])
    const radius = new Point(rx, rx)
    if (!_.isNil(opts[1])) {
      radius.y = project(state.transform, opts[1])
    }
    state.addShape(new CircleShape(state.pos, radius))
  }
}
