import _ from "lodash"
import { Point, Rectangle } from "paper"

export default class Shape {
  constructor(pos = new Point(0, 0)) {
    this.pos = pos.clone()
    this.rotation = 0
    this.brush = {}
    this.selected = false
    this.editing = false
    this.zIndex = 0
  }

  resize() {
    throw new Error("not implemented")
  }

  // 実際の表示領域を返す
  get bounds() {
    return new Rectangle(this.origin, this.size)
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
