import { Point } from "paper"
import PathShape from "./PathShape"

export default class RectShape extends PathShape {
  constructor(pos: Point, w = 0, h = 0) {
    super(
      pos,
      [new Point(0, 0), new Point(w, 0), new Point(w, h), new Point(0, h)],
      true
    )
  }
}
