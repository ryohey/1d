import _ from "lodash"
import { Point } from "paper"

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

  get size() {
    throw new Error("not implemented")
  }

  // 実際の表示領域を返す
  get bounds() {
    return {
      origin: this.origin,
      size: this.size
    }
  }

  // 表示上の位置
  get origin() {
    throw new Error("not implemented")
  }

  set origin(origin) {
    this.originY = origin.y
    this.originX = origin.x
  }

  set originX(x) {
    const { pos, bounds } = this
    this.pos.x = x + (pos.x - bounds.origin.x)
  }

  set originY(y) {
    const { pos, bounds } = this
    this.pos.y = y + (pos.y - bounds.origin.y)
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
