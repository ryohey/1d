import React from "react"
import { toSVGPath } from "./helpers/point"
import { rectPoints } from "./helpers/rect"

export default function SelectionRect({ rect }) {
  return (
    <path d={toSVGPath(rectPoints(rect), true)} stroke="gray" fill="none" />
  )
}
