import React from "react"
import Shape from "./Shape"
import _ from "lodash"

function toPoint(value) {
  if (_.isNumber(value)) {
    return {
      x: value,
      y: value
    }
  }
  return value
}

export default class CircleShape extends Shape {
  constructor(pos = { x: 0, y: 0 }, radius = 0) {
    super(pos)
    this.radius = toPoint(radius)
  }

  resize(size) {
    this.radius = size
  }

  render() {
    const { pos, radius, brush, mouseHandler } = this
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
    </g>
  }
}
