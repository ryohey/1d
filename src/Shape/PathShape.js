import React from "react"
import Shape from "./Shape"
import { pointAdd, toSVGPath, rect } from "../helpers/point"

const HANDLE_SIZE = 3

export default class PathShape extends Shape {
  constructor(pos = { x: 0, y: 0 }, path = [], closed = false) {
    super(pos)
    this.path = path
    this.closed = closed
  }

  render() {
    const { pos, closed, mouseHandler, brush } = this
    const points = this.path.map(p => pointAdd(p, pos))
    const path = toSVGPath(points, closed)
    const selected = true
    return <g
      onMouseOver={e => mouseHandler.onMouseOver(e, this)}
      onMouseDown={e => mouseHandler.onMouseDown(e, this)}>
      <path
        d={path}
        stroke={brush.stroke || "none"}
        fill={brush.fill || "none"}
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
