import React from "react"
import Shape from "./Shape"
import { pointAdd, pointSub, pointDot, toSVGPath, rect } from "../helpers/point"
import _ from "lodash"

const HANDLE_SIZE = 3

export default class PathShape extends Shape {
  constructor(pos = { x: 0, y: 0 }, path = [], closed = false) {
    super(pos)
    this.path = path
    this.closed = closed
  }

  resize(size) {
    const leftTop = {
      x: _.min(this.path.map(p => p.x)),
      y: _.min(this.path.map(p => p.y))
    }
    const rightBottom = {
      x: _.max(this.path.map(p => p.x)),
      y: _.max(this.path.map(p => p.y))
    }
    const w = rightBottom.x - leftTop.x
    const h = rightBottom.y - leftTop.y
    const scale = {
      x: size.x / w,
      y: size.y / h
    }
    this.path = this.path.map(p =>
      pointAdd(pointDot(pointSub(p, leftTop), scale), leftTop)
    )
  }

  render() {
    const { pos, closed, mouseHandler, brush, selected } = this
    const points = this.path.map(p => pointAdd(p, pos))
    const path = toSVGPath(points, closed)
    return <g
      onMouseOver={e => mouseHandler.onMouseOver(e, this)}
      onMouseDown={e => mouseHandler.onMouseDown(e, this)}>
      <path
        d={path}
        stroke={brush.stroke || "none"}
        strokeWidth={brush.strokeWidth || 1}
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
