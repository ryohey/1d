import React from "react"
import { Point } from "paper"
import Shape from "./Shape"
import { pointMul, pointAdd, toSVGPath } from "../helpers/point"

export default class GridShape extends Shape {
  constructor(pos = new Point(0, 0), scale = 1) {
    super(pos)
    this.scale = scale
  }

  get selected() {
    return false
  }

  set selected(v) {
    // not selectable
  }

  render() {
    const { scale, pos, brush } = this
    const paths = []
    const far = 9999
    for (let x = 0; x < 100; x++) {
      paths.push([new Point(x, 0), new Point(x, far)])
    }
    for (let y = 0; y < 100; y++) {
      paths.push([new Point(0, y), new Point(far, y)])
    }
    const path = paths
      .map(path => path.map(p => pointMul(pointAdd(p, pos), scale)))
      .map(toSVGPath)
      .join(" ")

    return <path
      d={path}
      stroke={brush.stroke || "none"}
      strokeWidth={brush.strokeWidth || 1}
      fill={brush.fill || "none"}
    />
  }
}
