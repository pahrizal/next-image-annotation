import Konva from 'konva'
import { KonvaEventObject } from 'konva/lib/Node'
import * as React from 'react'
import { Circle, Line, Rect } from 'react-konva'
import {
  getPointChunk,
  getRectangleAreaFromPolygon,
  interpolate,
} from './helper'
import Label from './Label'
import PointAdd from './PointAdd'
import ResizerHelperCircle from './ResizeCircle'
type PolygonShapeProps = {
  id?: string
  selected?: boolean
  onSelect?: () => void
  points: number[]
  fillColor?: string
  strokeColor?: string
  dotSize?: number
  strokeWidth?: number
  tension?: number
  showResizer?: boolean
  onResize?: (points: number[]) => void
  onAddPoint?: (points: number[]) => void
  label?: string
  onLabelEdit?: (label: string | null) => void
}

export default React.memo(function PolygonShape({
  id,
  selected = false,
  onSelect,
  points,
  fillColor = '#FFFFFF',
  strokeColor = '#FFFFFF22',
  dotSize = 8,
  strokeWidth = 1,
  tension = 0.01,
  onResize,
  showResizer,
  onAddPoint,
  label,
  onLabelEdit,
}: PolygonShapeProps) {
  const lineRef = React.useRef<Konva.Line>(null)
  const [newPoints, setNewPoints] = React.useState(points)
  const [showLabel, setShowLabel] = React.useState(false)
  const [resizerPoint, setResizerPoint] = React.useState(getPointChunk(points))
  const rectArea = getRectangleAreaFromPolygon(resizerPoint)
  const editLabel = () => {
    const newLabel = prompt('new label', label)
    onLabelEdit && onLabelEdit(newLabel)
  }
  return (
    <>
      <Line
        ref={lineRef}
        fill={fillColor}
        points={points}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        closed
        onMouseDown={onSelect}
        tension={tension}
        onMouseEnter={() => setShowLabel(true)}
        onMouseLeave={() => setShowLabel(false)}
        onDblClick={() => editLabel()}
      />
      {selected &&
        resizerPoint.map((pts, j) => (
          <>
            <PointAdd
              key={`dot-add-${j}`}
              points={interpolate(
                pts[0],
                pts[1],
                resizerPoint[j + 1 > resizerPoint.length - 1 ? 0 : j + 1][0],
                resizerPoint[j + 1 > resizerPoint.length - 1 ? 0 : j + 1][1]
              )}
              strokeWidth={strokeWidth}
              size={dotSize}
              onClick={(added) => {
                const oldPoints = [...lineRef.current!!.points()]
                const npoints = [
                  ...oldPoints.slice(0, j * 2 + 2),
                  ...added,
                  ...oldPoints.slice(j * 2 + 2),
                ]
                setResizerPoint(getPointChunk(npoints))
                lineRef.current!!.points(npoints)
                onResize && onResize(npoints)
              }}
            />
            <ResizerHelperCircle
              onDragMove={(id, pos) => {
                const oldPoints = [...lineRef.current!!.points()]
                const npoints = [
                  ...oldPoints.slice(0, id * 2),
                  pos[0],
                  pos[1],
                  ...oldPoints.slice(id * 2 + 2),
                ]
                lineRef.current!!.points(npoints)
                setResizerPoint(getPointChunk(npoints))
                setNewPoints(npoints)
              }}
              onDragEnd={(id, pos) => {
                onResize && onResize(lineRef.current!!.points())
              }}
              size={dotSize}
              pointIdx={j}
              points={pts}
              key={`dot-${j}`}
              strokeWidth={strokeWidth}
            />
          </>
        ))}
      {showResizer &&
        getPointChunk(points)
          .slice(0, -1)
          .map((pts, i) => (
            <ResizerHelperCircle
              size={dotSize}
              pointIdx={i}
              key={i}
              points={pts}
              strokeWidth={strokeWidth}
            />
          ))}
      {label && (selected || showLabel) && (
        <Label text={label} points={rectArea} />
      )}
    </>
  )
})
