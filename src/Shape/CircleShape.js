import React from "react"
import Shape from "./Shape"
import _ from "lodash"
import { pointMul, pointSub, pointAdd, pointDot } from "../helpers/point"
import renderPathHandle from "../helpers/renderPathHandle"

function toPoint(value) {
  if (_.isNumber(value)) {
    return {
      x: value,
      y: value
    }
  }
  return value
}

function pointsAround(pos, radius) {
  return [
    { x: pos.x, y: pos.y - radius.y },
    { x: pos.x + radius.x, y: pos.y },
    { x: pos.x, y: pos.y + radius.y },
    { x: pos.x - radius.x, y: pos.y },
  ]
}

// スケーリングした時の位置のずれを計算する
export function moveByAnchor(pos, delta, anchor) {
  return pointAdd(pos,
    pointDot(delta,
      pointSub(anchor, { x: 0.5, y: 0.5 })))
}

export default class CircleShape extends Shape {
  constructor(pos = { x: 0, y: 0 }, radius = 0) {
    super(pos)
    this.radius = toPoint(radius)
  }

  resize(size, anchor) {
    const radius = pointMul(size, 0.5)
    const delta = pointMul(pointSub(this.radius, radius), 2)
    this.radius = radius
    this.pos = moveByAnchor(this.pos, delta, anchor)
  }

  render() {
    const { pos, radius, brush, mouseHandler, selected } = this
    return <g
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
      {selected && renderPathHandle(pointsAround(pos, radius))}
    </g>
  }
}
