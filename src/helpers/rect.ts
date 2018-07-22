import { Rectangle, Point } from "paper"

export function rectPoints(rect: Rectangle): Point[] {
  return [rect.topLeft, rect.topRight, rect.bottomRight, rect.bottomLeft]
}
