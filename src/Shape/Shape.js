import _ from "lodash"
import { pointCopy } from "../helpers/point"

export default class Shape {
  constructor(pos = { x: 0, y: 0 }) {
    this.pos = pointCopy(pos)
  }

  render() {
    throw new Error("not implemented")
  }

  clone() {
    return _.clone(this)
  }
}
