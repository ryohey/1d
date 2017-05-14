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

  get origin() {
    return pointSub(this.pos, this.radius)
  }

  render() {
    const { pos, radius, brush, mouseHandler, selected, bounds, rotation } = this
    const ellipseProps = {
      transform: `rotate(${rotation} ${pos.x} ${pos.y})`,
      rx: radius.x,
      ry: radius.y,
      strokeWidth: brush.strokeWidth || 1,
      cx: pos.x,
      cy: pos.y
    }
    return <g
      data-shape-id={this.id}
      cursor="move"
      onMouseDown={e => mouseHandler.onMouseDown(e, this)}>
      <ellipse
        {...ellipseProps}
        stroke={brush.stroke || "none"}
        fill={brush.fill || "none"}
      />
      {/* 当たり判定用の透明な円 */}
      <ellipse
        {...ellipseProps}
        stroke="rgba(0,0,0,0)"
        fill="rgba(0,0,0,0)"
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
