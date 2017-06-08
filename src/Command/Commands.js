import copy from "./CopyCommand"
import rect from "./RectCommand"
import move from "./MoveCommand"
import moveTo from "./MoveToCommand"
import line from "./LineCommand"
import lineTo from "./LineToCommand"
import close from "./CloseCommand"
import circle from "./CircleCommand"
import text from "./TextCommand"
import translate from "./TranslateCommand"
import translateTo from "./TranslateToCommand"
import stroke from "./StrokeCommand"
import curveTo from "./CurveToCommand"
import grid from "./GridCommand"
import resize from "./ResizeCommand"
import fontSize from "./FontSizeCommand"
import fill from "./FillCommand"
import strokeWidth from "./StrokeWidthCommand"
import name from "./NameCommand"
import select from "./SelectCommand"
import deselect from "./DeselectCommand"
import smoothCurveTo from "./SmoothCurveToCommand"
import ellipticalArc from "./EllipticalArcCommand"
import align from "./AlignCommand"
import deselectAll from "./DeselectAllCommand"
import dist from "./DistCommand"
import rotate from "./RotateCommand"
import rotateTo from "./RotateToCommand"
import remove from "./RemoveCommand"
import selectAll from "./SelectAllCommand"
import edit from "./EditCommand"
import changeText from "./ChangeTextCommand"
import fontFamily from "./FontFamilyCommand"
import bringToFront from "./BringToFrontCommand"
import sendToBack from "./SendToBackCommand"

export default [
  rect,
  copy,
  move,
  moveTo,
  line,
  lineTo,
  close,
  circle,
  text,
  fontSize,
  translate,
  translateTo,
  stroke,
  curveTo,
  grid,
  resize,
  fill,
  strokeWidth,
  name,
  select,
  deselect,
  smoothCurveTo,
  ellipticalArc,
  align,
  deselectAll,
  dist,
  rotate,
  rotateTo,
  remove,
  selectAll,
  edit,
  changeText,
  fontFamily,
  bringToFront,
  sendToBack
]
