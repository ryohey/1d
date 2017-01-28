import Shape from "./Shape"
import PathShape from "./PathShape"

export default class RectShape extends Shape {
  constructor(pos = { x: 0, y: 0 }, w = 0, h = 0) {
    super(pos)
    this.pathShape = new PathShape(pos, [
      { x: 0, y: 0 },
      { x: w, y: 0 },
      { x: w, y: h },
      { x: 0, y: h },
    ])
    this.pathShape.closed = true
  }

  render(brush) {
    return this.pathShape.render(brush)
  }
}
