import React from "react"
import Shape from "./Shape"

export default class CircleShape extends Shape {
  constructor(pos = { x: 0, y: 0 }, radius = 0) {
    super(pos)
    this.radius = radius
  }

  resize(size) {
    // TODO: リサイズと楕円の実装
  }

  render() {
    const { pos, radius, brush, mouseHandler } = this
    return <g
      cursor="move"
      onMouseOver={e => mouseHandler.onMouseOver(e, this)}
      onMouseDown={e => mouseHandler.onMouseDown(e, this)}>
      <circle
        r={radius}
        stroke={brush.stroke || "none"}
        strokeWidth={brush.strokeWidth || 1}
        fill={brush.fill || "none"}
        cx={pos.x}
        cy={pos.y}
      />
    </g>
  }
}
