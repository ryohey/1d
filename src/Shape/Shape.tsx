import _ from "lodash"
import { Point, Rectangle, Size } from "paper"
import { IBrush } from "./IBrush"
import { IMouseHandler } from "../MouseHandler/IMouseHandler"

export default class Shape {
  pos: Point = new Point(0, 0)
  rotation = 0
  brush: IBrush = {
    stroke: "black"
  }
  selected = false
  editing = false
  zIndex = 0
  origin: Point = new Point(0, 0)
  size: Size = new Size(0, 0)
  name: string | undefined
  id: string | undefined
  mouseHandler: IMouseHandler

  constructor(pos = new Point(0, 0)) {
    this.pos = pos.clone()
  }

  resize(size: Point, anchor: Point) {
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
