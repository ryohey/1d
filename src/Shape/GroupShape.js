import React from "react"
import { Point } from "paper"
import Shape from "./Shape"
import { toSVGPath } from "../helpers/point"
import { rectUnion, rectPoints } from "../helpers/rect"
import ShapeControl from "../components/ShapeControl"

export default class GroupShape extends Shape {
  constructor(pos = new Point(0, 0), shapes = []) {
    super(pos)
    this.shapes = shapes
  }

  get bounds() {
    return this.shapes.reduce(rectUnion)
  }

  get size() {
    return this.bounds.size
  }

  get origin() {
    return this.bounds.origin
  }

  resize(size, anchor) {
    const { bounds } = this
    const delta = size.divide(bounds.size)
    this.shapes.forEach(s => s.resize(
      s.size.multiply(delta),
      s.origin.subtract(bounds.origin).divide(s.size).multiply(-1)
    ))
  }

  render() {
    const { id, pos, mouseHandler, selected, bounds } = this
    console.log(bounds)

    return <g
      data-shape-id={id}
      cursor="move"
      onMouseDown={e => mouseHandler.onMouseDown(e, this)}
      transform={`translate(${pos.x}, ${pos.y})`}>
      {this.shapes.map(s => s.render())}
      {/* 当たり判定用の透明な矩形 */}
      <path
        d={toSVGPath(rectPoints(bounds))}
        strokeWidth={10 /* 当たり判定を広げる */ }
        stroke="rgba(0,0,0,0)"
        fill="rgba(0,0,0,0)"
      />
      {selected && <ShapeControl
        rect={bounds}
        anchor={pos}
        onMouseDown={(e, anchor) => {
          mouseHandler.onMouseDown(e, this, anchor)
        }} />}
    </g>
  }
}
