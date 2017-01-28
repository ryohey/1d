import React from "react"
import Shape from "./Shape"
import { project, pointAdd, toSVGPath, rect } from "../helpers/point"

const HANDLE_SIZE = 3

export default class PathShape extends Shape {
  constructor(pos = { x: 0, y: 0 }, path = []) {
    super(pos)
    this.path = path
    this.closed = false
  }

  render(ctx) {
    const points = this.path.map(p => project(ctx, pointAdd(p, this.pos)))
    const path = toSVGPath(points, this.closed)
    const onMouseOver = e => {
      console.log(e)
    }
    const selected = true
    return <g>
      <path
        onMouseOver={onMouseOver}
        d={path}
        stroke={ctx.stroke || "none"}
        fill={ctx.fill || "none"}
        cursor="move"
      />
      {selected && points.map(p =>
        <path
          d={toSVGPath(rect(p, HANDLE_SIZE), true)}
          stroke="gray"
          fill="white"
          cursor="pointer"
        />
      )}
    </g>
  }
}
