import _ from "lodash"
import { pointCopy, pointAdd, project } from "../helpers/point"
import { InvalidStateError } from "../Error.js"
import PathShape from "../Shape/PathShape"
import GroupShape from "../Shape/GroupShape"

/**
 コマンド実行中に生成された Shape などの状態を
 コマンドをまたいで利用する処理などをまとめる
 */
export default class RenderState {
  constructor(mouseHandler) {
    this.mouseHandler = mouseHandler
    this.lastId = 0
    this.pos = { x: 0, y: 0 }
    this.transform = {
      scale: 1
    }
    this.shapes = []
  }

  get lastShape() {
    return this.shapes[this.shapes.length - 1]
  }

  get selectedShapes() {
    return this.shapes.filter(s => s.selected)
  }

  get currentShapes() {
    const selected = this.selectedShapes
    if (selected.length > 0) {
      return selected
    }
    return this.lastShape ? [this.lastShape] : []
  }

  get currentShape() {
    return this.currentShapes[0]
  }

  targetShapes(com) {
    const target = this.findShape(com.target)
    return target ? [target] : this.currentShapes
  }

  addShape(shape) {
    shape.id = this.lastId
    shape.mouseHandler = this.mouseHandler
    this.shapes.push(shape)
    this.deselectAll()
    shape.selected = true
    this.lastId++
  }

  removeShape(shape) {
    _.pull(this.shapes, shape)
  }

  findShape(nameOrId) {
    if (!nameOrId) {
      return
    }
    return this.shapes.filter(s => `${s.id}` === nameOrId || s.name === nameOrId)[0]
  }

  deselectAll() {
    this.shapes.forEach(s => s.selected = false)
  }

  move(x, y) {
    this.pos = pointAdd(this.pos, project(this.transform, { x, y }))
  }

  addPosToCurrentShapePath() {
    this.currentShape.path.push(pointCopy(this.pos))
  }

  preparePathShape() {
    let shape = this.currentShape
    if (!(shape instanceof PathShape) || shape.closed) {
      shape = new PathShape()
      this.addShape(shape)
      this.addPosToCurrentShapePath()
    }
  }

  select(nameOrId) {
    const found = this.findShape(nameOrId)
    if (!found) {
      return InvalidStateError("no shapes to select")
    }
    found.selected = true
  }

  // 与えられた shape をグループ化する
  createGroup(shapes) {
    this.shapes = this.shapes.filter(s => !shapes.includes(s))
    shapes.forEach(s => s.selected = false)
    this.addShape(new GroupShape(this.pos, shapes))
  }
}
