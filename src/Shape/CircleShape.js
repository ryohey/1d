import React from "react"
import Shape from "./Shape"

export default class CircleShape extends Shape {
  constructor(pos = { x: 0, y: 0 }, radius = 0) {
    super(pos)
    this.radius = radius
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
        fill={brush.fill || "none"}
        cx={pos.x}
        cy={pos.y}
      />
    </g>
  }
}
