import React from "react"
import { toSVGPath, rect, pointAdd, pointDot } from "./helpers/point"

const HANDLE_SIZE = 3
const DOT_SIZE = 3
const COLOR = "rgb(37, 129, 255)"

const anchors = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 0, y: 1 },
]

function ControlRect({ center, onMouseDown }) {
  return <path
    d={toSVGPath(rect(center, HANDLE_SIZE), true)}
    stroke={COLOR}
    fill="white"
    cursor="pointer"
    onMouseDown={onMouseDown}
  />
}

function ControlDot({ center }) {
  return <path
    d={toSVGPath(rect(center, DOT_SIZE), true)}
    fill={COLOR}
  />
}

export default function ShapeControl({ pos, anchor, size, onMouseDown }) {
  const corners = anchors.map(a => [a, pointAdd(pos, pointDot(size, a))])
  return <g transform="translate(0.5 0.5)">
    {corners.map((c, i) => {
      const next = corners[(i + 1) % corners.length]
      return <path
        d={toSVGPath([c[1], next[1]])}
        stroke={COLOR}
      />
    })}
    {corners.map(c =>
      <ControlRect
        center={c[1]}
        onMouseDown={e => {
          e.stopPropagation()
          onMouseDown(e, c[0])
        }}
      />
    )}
    {anchor && <ControlDot center={anchor} />}
  </g>
}
