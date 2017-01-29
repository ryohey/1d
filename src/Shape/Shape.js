import _ from "lodash"
import { pointCopy } from "../helpers/point"

export default class Shape {
  constructor(pos = { x: 0, y: 0 }) {
    this.pos = pointCopy(pos)
    this.brush = {}
  }

  render() {
    throw new Error("not implemented")
  }

  clone() {
    const s = _.clone(this)
    s.name = undefined
    s.id = undefined
    s.brush = {}
    return s
  }
}
