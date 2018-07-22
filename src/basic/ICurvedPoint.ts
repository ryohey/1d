import { IPoint } from "./IPoint"

export interface ICurvedPoint {
  x: number
  y: number
  c?: IPoint
  c1?: IPoint
  c2?: IPoint
  command?: "curveto" | "elliptical arc" | "smooth curveto"
  code?: "C" | "A" | "S"
  r?: IPoint
  xAxisRotation?: number
  largeArc?: number
  sweep?: number
}
