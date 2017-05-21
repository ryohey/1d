import React from "react"
import Icon from "./Icon"

import "./AlignmentToolbar.css"

export default function AlignmentToolbar({
  onClickDistX,
  onClickDistY,
  onClickAlignLeft,
  onClickAlignCenter,
  onClickAlignRight,
  onClickAlignTop,
  onClickAlignMiddle,
  onClickAlignBottom
}) {
  return <div className="form AlignmentToolbar">
    <div className="row buttons">
      <Icon name="reorder-vertical" onClick={onClickDistX} />
      <Icon name="reorder-horizontal" onClick={onClickDistY} />
      <Icon name="format-horizontal-align-left" onClick={onClickAlignLeft} />
      <Icon name="format-horizontal-align-center" onClick={onClickAlignCenter} />
      <Icon name="format-horizontal-align-right" onClick={onClickAlignRight} />
      <Icon name="format-vertical-align-top" onClick={onClickAlignTop} />
      <Icon name="format-vertical-align-center" onClick={onClickAlignMiddle} />
      <Icon name="format-vertical-align-bottom" onClick={onClickAlignBottom} />
    </div>
  </div>
}
