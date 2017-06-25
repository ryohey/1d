import React from "react"
import { Point } from "paper"
import { toSVGPath } from "./helpers/point"

function rectPath({ origin, size }) {
  return [
    origin,
    new Point(origin.x + size.x, origin.y),
    new Point(origin.x + size.x, origin.y + size.y),
    new Point(origin.x, origin.y + size.y),
  ]
}

export default function SelectionRect({ rect }) {
  return <path
    d={toSVGPath(rectPath(rect), true)}
    stroke="gray"
    fill="none"
  />
}
