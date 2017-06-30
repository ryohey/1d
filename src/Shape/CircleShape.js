import React from "react"
import _ from "lodash"
import { Point, Rectangle } from "paper"
import Shape from "./Shape"
import ShapeControl from "../components/ShapeControl"

// スケーリングした時の位置のずれを計算する
export function moveByAnchor(pos, delta, anchor) {
  return delta
    .multiply(anchor.subtract(new Point(0.5, 0.5)))
    .add(pos)
}

export default class CircleShape extends Shape {
  constructor(pos, radius) {
    super(pos)
    this.radius = radius
  }

  resize(size, anchor) {
    const radius = size.multiply(0.5)
    const delta = this.radius.subtract(radius).multiply(2)
    this.radius = radius
    this.pos = moveByAnchor(this.pos, delta, anchor)
  }

  get bounds() {
    return new Rectangle(
      this.pos.subtract(this.radius),
      this.pos.add(this.radius))
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
        key="content"
        stroke={brush.stroke || "none"}
        fill={brush.fill || "none"}
      />
      {/* 当たり判定用の透明な円 */}
      <ellipse
        {...ellipseProps}
        key="hitTest"
        stroke="rgba(0,0,0,0)"
        fill="rgba(0,0,0,0)"
      />
      {selected && <ShapeControl
        rect={bounds}
        anchor={pos}
        onMouseDown={(e, anchor) => {
          mouseHandler.onMouseDown(e, this, anchor)
        }} />
      }
    </g>
  }
}
