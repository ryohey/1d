import React from "react"
import Shape from "./Shape"

export default class CircleShape extends Shape {
  constructor(pos = { x: 0, y: 0 }, radius = 0) {
    super(pos)
    this.radius = radius
  }

  render({ stroke, fill }) {
    const { pos, radius } = this
    return <circle
      r={radius}
      stroke={stroke || "none"}
      fill={fill || "none"}
      cx={pos.x}
      cy={pos.y}
    />
  }
}
