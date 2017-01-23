import React from "react"
import Shape from "./Shape"
import { project } from "../helpers/point"

export default class CircleShape extends Shape {
  constructor(pos = { x: 0, y: 0 }, radius = 0) {
    super(pos)
    this.radius = radius
  }

  render(ctx) {
    const pos = project(ctx, this.pos)
    return <circle
      r={project(ctx, this.radius)}
      stroke={ctx.stroke || "none"}
      fill={ctx.fill || "none"}
      cx={pos.x}
      cy={pos.y}
    />
  }
}
