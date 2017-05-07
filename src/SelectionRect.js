import React from "react"
import { toSVGPath, rect, pointAdd, pointDot } from "./helpers/point"

function rectPath({ origin, size }) {
  return [
    origin,
    { x: origin.x + size.x, y: origin.y },
    { x: origin.x + size.x, y: origin.y + size.y },
    { x: origin.x, y: origin.y + size.y },
  ]
}

export default function SelectionRect({ rect }) {
  return <path
    d={toSVGPath(rectPath(rect), true)}
    stroke="gray"
    fill="none"
  />
}
