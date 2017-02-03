import _ from "lodash"
import { pointCopy } from "../helpers/point"

export default class Shape {
  constructor(pos) {
    this.pos = pointCopy(pos)
    this.brush = {}
  }

  resize() {
    throw new Error("not implemented")
  }

  get size() {
    throw new Error("not implemented")
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
