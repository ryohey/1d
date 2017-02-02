import React from "react"
import { toSVGPath, rect, pointAdd, pointDot } from "./helpers/point"

const HANDLE_SIZE = 3

const anchors = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 0, y: 1 },
]

function ControlRect({ center, onMouseDown }) {
  return <path
    d={toSVGPath(rect(center, HANDLE_SIZE), true)}
    stroke="gray"
    fill="white"
    cursor="pointer"
    onMouseDown={onMouseDown}
  />
}

export default function ShapeControl({ pos, size, onMouseDown }) {
  const corners = anchors.map(a => [a, pointAdd(pos, pointDot(size, a))])
  return <g>
    {corners.map((c, i) => {
      const next = corners[(i + 1) % corners.length]
      return <path
        d={toSVGPath([c[1], next[1]])}
        stroke="gray"
      />
    })}
    {corners.map(c =>
      <ControlRect
        center={c[1]}
        onMouseDown={e => onMouseDown(e, c[0])}
      />
    )}
  </g>
}
