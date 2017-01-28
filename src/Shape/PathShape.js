import React from "react"
import Shape from "./Shape"
import { pointAdd, toSVGPath, rect } from "../helpers/point"

const HANDLE_SIZE = 3

export default class PathShape extends Shape {
  constructor(pos = { x: 0, y: 0 }, path = []) {
    super(pos)
    this.path = path
    this.closed = false
  }

  render({ stroke, fill }) {
    const { pos, closed } = this
    const points = this.path.map(p => pointAdd(p, pos))
    const path = toSVGPath(points, closed)
    const onMouseOver = e => {
      console.log(e)
    }
    const selected = true
    return <g>
      <path
        onMouseOver={onMouseOver}
        d={path}
        stroke={stroke || "none"}
        fill={fill || "none"}
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
