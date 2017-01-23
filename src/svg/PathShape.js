import React from "react"
import Shape from "./Shape"
import { projcet, pointAdd, toSVGPath } from "../helpers/point"

class PathShape extends Shape {
  constructor(pos = { x: 0, y: 0 }, path = []) {
    super(pos)
    this.path = path
    this.closed = false
  }

  render(ctx) {
    const path = toSVGPath(this.path.map(p => project(ctx, pointAdd(p, this.pos))), this.closed)
    return <path
      d={path}
      stroke={ctx.stroke || "none"}
      fill={ctx.fill || "none"}
    />
  }
}
