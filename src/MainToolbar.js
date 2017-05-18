import React from "react"
import Icon from "./Icon"

import "./MainToolbar.css"

function ToolbarButton({ title, onClick, selected = false }) {
  return <div
    className={`button ${selected ? "selected" : ""}`}
    onClick={onClick}>{title}</div>
}

function ToolbarSeparator() {
  return <div className="ToolbarSeparator" />
}

export default function MainToolbar({
  mouseMode,
  onClickSave,
  onClickExport,
  onFileOpen,
  onClickRect,
  onClickCircle,
  onClickLine,
  onClickPath,
  onClickText,
  onClickOptimize
}) {
  return <div className="toolbar">
    <ToolbarButton onClick={onClickSave} title="save" />
    <ToolbarButton onClick={onClickExport} title="export" />
    <label className="button">open
      <input style={{display: "none"}} type="file" onChange={onFileOpen} accept=".svg" />
    </label>
    <ToolbarSeparator />
    <ToolbarButton onClick={onClickRect} title="rect" selected={mouseMode === "rect"} />
    <ToolbarButton onClick={onClickCircle} title="circle" selected={mouseMode === "circle"} />
    <ToolbarButton onClick={onClickLine} title="line" selected={mouseMode === "line"} />
    <ToolbarButton onClick={onClickPath} title="path" selected={mouseMode === "path"} />
    <ToolbarButton onClick={onClickText} title="text" selected={mouseMode === "text"} />
    <ToolbarSeparator />
    <ToolbarButton onClick={onClickOptimize} title="clean up" />
  </div>
}
