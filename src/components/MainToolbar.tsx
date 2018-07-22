import React, { SFC } from "react"

import "./MainToolbar.css"

interface ToolbarButtonProps {
  onClick?: () => void
  selected?: boolean
}

const ToolbarButton: SFC<ToolbarButtonProps> = ({
  children,
  onClick,
  selected = false
}) => {
  return (
    <div className={`button ${selected ? "selected" : ""}`} onClick={onClick}>
      {children}
    </div>
  )
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
  return (
    <div className="toolbar">
      <ToolbarButton onClick={onClickSave}>save</ToolbarButton>
      <ToolbarButton onClick={onClickExport}>export</ToolbarButton>
      <label className="button">
        open
        <input
          style={{ display: "none" }}
          type="file"
          onChange={onFileOpen}
          accept=".svg"
        />
      </label>
      <ToolbarSeparator />
      <ToolbarButton onClick={onClickRect} selected={mouseMode === "rect"}>
        rect
      </ToolbarButton>
      <ToolbarButton onClick={onClickCircle} selected={mouseMode === "circle"}>
        circle
      </ToolbarButton>
      <ToolbarButton onClick={onClickLine} selected={mouseMode === "line"}>
        line
      </ToolbarButton>
      <ToolbarButton onClick={onClickPath} selected={mouseMode === "path"}>
        path
      </ToolbarButton>
      <ToolbarButton onClick={onClickText} selected={mouseMode === "text"}>
        text
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton onClick={onClickOptimize}>clean up</ToolbarButton>
      <ToolbarButton>
        <a href="https://github.com/ryohey/1d" target="_blank">
          GitHub
        </a>
      </ToolbarButton>
    </div>
  )
}
