import React from "react"
import ColorButton from "./ColorButton"

export default function ShapePropsForm({
  selectedShape,
  selectedShapeSize,
  onChangeSizeWidth,
  onChangeSizeHeight,
  onChangePositionX,
  onChangePositionY,
  onChangeRotation,
  onChangeFillColor,
  onChangeFillColorComplete,
  onChangeStrokeColor,
  onChangeStrokeColorComplete,
  onChangeLineWidth,
  onChangeLineWidthComplete
}) {
  return <div className="form ShapePropsForm">
    <div className="row">
      <label>size</label>
      <div className="input-group">
        <div className="named-input">
          <input
            type="number"
            value={selectedShapeSize.x}
            onChange={onChangeSizeWidth} />
          <label>width</label>
        </div>
        <div className="named-input">
          <input
            type="number"
            value={selectedShapeSize.y}
            onChange={onChangeSizeHeight} />
          <label>height</label>
        </div>
        </div>
    </div>
    <div className="row">
      <label>position</label>
      <div className="input-group">
        <div className="named-input">
          <input
            type="number"
            value={selectedShape.pos.x}
            onChange={onChangePositionX} />
          <label>x</label>
        </div>
        <div className="named-input">
          <input
            type="number"
            value={selectedShape.pos.y}
            onChange={onChangePositionY} />
          <label>y</label>
        </div>
        </div>
    </div>
    <div className="row">
      <label>transform</label>
      <div className="input-group">
        <div className="named-input">
          <input
            type="number"
            value={selectedShape.rotation}
            onChange={onChangeRotation} />
          <label>rotate</label>
        </div>
      </div>
    </div>
    <div className="row">
      <label>fill</label>
      <ColorButton
        color={selectedShape.brush.fill}
        onChange={onChangeFillColor}
        onChangeComplete={onChangeFillColorComplete} />
    </div>
    <div className="row">
      <label>stroke</label>
      <ColorButton
        color={selectedShape.brush.stroke}
        onChange={onChangeStrokeColor}
        onChangeComplete={onChangeStrokeColorComplete} />
    </div>
    <div className="row">
      <label>line width</label>
      <input
        type="range"
        min={0} max={10}
        value={selectedShape.brush.strokeWidth || 0}
        onInput={onChangeLineWidth}
        onMouseUp={onChangeLineWidthComplete} />
    </div>
  </div>
}
