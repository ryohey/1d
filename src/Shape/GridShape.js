import React from "react"
import Shape from "./Shape"
import { pointMul, pointAdd, toSVGPath } from "../helpers/point"

export default class GridShape extends Shape {
  constructor(pos = { x: 0, y: 0 }, scale = 1) {
    super(pos)
    this.scale = scale
  }

  render({ stroke, fill }) {
    const { scale, pos } = this
    const paths = []
    const far = 9999
    for (let x = 0; x < 100; x++) {
      paths.push([{ x, y: 0 }, { x, y: far }])
    }
    for (let y = 0; y < 100; y++) {
      paths.push([{ x: 0, y }, { x: far, y }])
    }
    const path = paths
      .map(path => path.map(p => pointMul(pointAdd(p, pos), scale)))
      .map(toSVGPath)
      .join(" ")

    return <path
      d={path}
      stroke={stroke || "none"}
      fill={fill || "none"}
    />
  }
}
