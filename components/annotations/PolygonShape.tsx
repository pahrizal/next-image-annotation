import Konva from 'konva'
import { KonvaEventObject } from 'konva/lib/Node'
import * as React from 'react'
import { Circle, Line, Rect } from 'react-konva'
import { interpolate } from './helper'
import PointAdd from './PointAdd'
import ResizerHelperCircle from './ResizeCircle'
type PolygonShapeProps = {
  id?: string
  selected?: boolean
  onSelect?: () => void
  points: number[]
  color?: string
  dotSize?: number
  strokeWidth?: number
  tension?: number
  showResizer?: boolean
  onResize?: (points: number[]) => void
  onAddPoint?: (points: number[]) => void
}

export default React.memo(function PolygonShape({
  id,
  selected = false,
  onSelect,
  points,
  color = '#FFFFFF',
  dotSize = 8,
  strokeWidth = 1,
  tension = 0.01,
  onResize,
  showResizer,
  onAddPoint,
}: PolygonShapeProps) {
  const lineRef = React.useRef<Konva.Line>(null)

  const pointChunks: number[][] = points.reduce(
    (t: number[][], c, i) => (i % 2 ? t : [...t, points.slice(i, i + 2)]),
    []
  )

  return (
    <>
      <Line
        ref={lineRef}
        fill={`${color}22`}
        points={points}
        stroke={color}
        strokeWidth={strokeWidth}
        closed
        onMouseDown={onSelect}
        tension={tension}
      />
      {selected &&
        pointChunks.map((pts, j) => (
          <>
            <PointAdd
              key={`dot-add-${j}`}
              points={interpolate(
                pts[0],
                pts[1],
                pointChunks[j + 1 > pointChunks.length - 1 ? 0 : j + 1][0],
                pointChunks[j + 1 > pointChunks.length - 1 ? 0 : j + 1][1]
              )}
              strokeWidth={strokeWidth}
              size={dotSize}
              onClick={(added) => {
                const oldPoints = [...lineRef.current!!.points()]
                const newPoints = [
                  ...oldPoints.slice(0, j * 2 + 2),
                  ...added,
                  ...oldPoints.slice(j * 2 + 2),
                ]
                lineRef.current!!.points(newPoints)
                onResize && onResize(newPoints)
              }}
            />
            <ResizerHelperCircle
              onDragMove={(id, pos) => {
                const oldPoints = [...lineRef.current!!.points()]
                const newPoints = [
                  ...oldPoints.slice(0, id * 2),
                  pos[0],
                  pos[1],
                  ...oldPoints.slice(id * 2 + 2),
                ]
                lineRef.current!!.points(newPoints)
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
        pointChunks
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
    </>
  )
})
