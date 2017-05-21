import React from "react"
import ColorButton from "./ColorButton"
import TextShape from "../Shape/TextShape"

function Row({ children, label }) {
  return <div className="row">
    <label>{ label }</label>
    { children }
  </div>
}

function Group({ children }) {
  return <div className="input-group">{ children }</div>
}

function NumberInput({ value, onChange }) {
  return <input
    type="number"
    value={value}
    onChange={onChange} />
}

function NamedInput({ label, children }) {
  return <div className="named-input">
    { children }
    <label>{ label }</label>
  </div>
}

function TextPropsForm({ shape, onChangeFontSize }) {
  return <div>
    <Row label="font size">
      <NumberInput value={shape.fontSize} onChange={onChangeFontSize} />
    </Row>
    <Row label="font">
      <select>
        <option>
        </option>
      </select>
    </Row>
  </div>
}

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
    <Row label="size">
      <Group>
        <NamedInput label="width">
          <NumberInput
            value={selectedShapeSize.x}
            onChange={onChangeSizeWidth} />
        </NamedInput>
        <NamedInput label="height">
          <NumberInput
            value={selectedShapeSize.y}
            onChange={onChangeSizeHeight} />
        </NamedInput>
      </Group>
    </Row>
    <Row label="position">
      <Group>
        <NamedInput label="x">
          <NumberInput
            value={selectedShape.pos.x}
            onChange={onChangePositionX} />
        </NamedInput>
        <NamedInput label="y">
          <NumberInput
            value={selectedShape.pos.y}
            onChange={onChangePositionY} />
        </NamedInput>
      </Group>
    </Row>
    <Row label="transform">
      <Group>
        <NamedInput label="rotate">
          <NumberInput
            value={selectedShape.rotation}
            onChange={onChangeRotation} />
        </NamedInput>
      </Group>
    </Row>
    <Row label="fill">
      <ColorButton
        color={selectedShape.brush.fill}
        onChange={onChangeFillColor}
        onChangeComplete={onChangeFillColorComplete} />
    </Row>
    <Row label="stroke">
      <ColorButton
        color={selectedShape.brush.stroke}
        onChange={onChangeStrokeColor}
        onChangeComplete={onChangeStrokeColorComplete} />
    </Row>
    <Row label="line width">
      <input
        type="range"
        min={0} max={10}
        value={selectedShape.brush.strokeWidth || 0}
        onInput={onChangeLineWidth}
        onMouseUp={onChangeLineWidthComplete} />
    </Row>
    {selectedShape instanceof TextShape &&
      <TextPropsForm
        shape={selectedShape}
      />
    }
  </div>
}
