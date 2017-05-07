import React from "react"
import Shape from "./Shape"
import _ from "lodash"
import { pointMul, pointSub, pointAdd, pointDot } from "../helpers/point"
import ShapeControl from "../ShapeControl"

// スケーリングした時の位置のずれを計算する
export function moveByAnchor(pos, delta, anchor) {
  return pointAdd(pos,
    pointDot(delta,
      pointSub(anchor, { x: 0.5, y: 0.5 })))
}

export default class CircleShape extends Shape {
  constructor(pos = { x: 0, y: 0 }, radius) {
    super(pos)
    this.radius = radius
  }

  resize(size, anchor) {
    const radius = pointMul(size, 0.5)
    const delta = pointMul(pointSub(this.radius, radius), 2)
    this.radius = radius
    this.pos = moveByAnchor(this.pos, delta, anchor)
  }

  get size() {
    return pointMul(this.radius, 2)
  }

  get bounds() {
    const { pos, radius, size } = this
    return {
      origin: pointSub(pos, radius),
      size
    }
  }

  render() {
    const { pos, radius, brush, mouseHandler, selected, bounds } = this
    return <g
      data-shape-id={this.id}
      cursor="move"
      onMouseOver={e => mouseHandler.onMouseOver(e, this)}
      onMouseDown={e => mouseHandler.onMouseDown(e, this)}>
      <ellipse
        rx={radius.x}
        ry={radius.y}
        stroke={brush.stroke || "none"}
        strokeWidth={brush.strokeWidth || 1}
        fill={brush.fill || "none"}
        cx={pos.x}
        cy={pos.y}
      />
      {selected && <ShapeControl
        pos={bounds.origin}
        size={bounds.size}
        anchor={pos}
        onMouseDown={(e, anchor) => {
          mouseHandler.onMouseDown(e, this, anchor)
        }} />
      }
    </g>
  }
}
