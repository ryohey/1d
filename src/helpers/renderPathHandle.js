import React from "react"
import { toSVGPath, rect } from "../helpers/point"

const HANDLE_SIZE = 3

export default function renderPathHandle(points) {
  return points.map(p => <path
    d={toSVGPath(rect(p, HANDLE_SIZE), true)}
    stroke="gray"
    fill="white"
    cursor="pointer"
  />)
}
