import PathShape from "./PathShape"

export default class RectShape extends PathShape {
  constructor(pos = { x: 0, y: 0 }, w = 0, h = 0) {
    super(pos, [
      { x: 0, y: 0 },
      { x: w, y: 0 },
      { x: w, y: h },
      { x: 0, y: h },
    ], true)
  }
}
