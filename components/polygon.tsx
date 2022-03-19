import Konva from 'konva'
import { KonvaEventObject } from 'konva/lib/Node'
import * as React from 'react'
import { Line } from 'react-konva'
import ResizerHelperCircle from './resize-helper-circle'
type PolygonShapeProps = {
  id?: string
  selected?: boolean
  onSelect?: () => void
  points: number[]
  color?: string
  dotSize?: number
  tension?: number
  onResize?: (points: number[]) => void
}

export default React.memo(function Polygon({
  id,
  selected = false,
  onSelect,
  points,
  color = '#FFFFFF',
  dotSize = 8,
  tension = 0.01,
  onResize,
}: PolygonShapeProps) {
  const lineRef = React.useRef<Konva.Line>(null)
  const onMouseEnter = (event: KonvaEventObject<MouseEvent>) => {
    if (!selected) return
    event.target.getStage()!!.container().style.cursor = 'move'
  }

  const onMouseLeave = (event: KonvaEventObject<MouseEvent>) => {
    if (!selected) return
    event.target.getStage()!!.container().style.cursor = 'crosshair'
  }
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
        strokeWidth={1}
        closed
        onMouseDown={onSelect}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        tension={tension}
      />
      {selected &&
        pointChunks.map((pts, j) => (
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
              onResize!!(lineRef.current!!.points())
            }}
            size={dotSize}
            pointIdx={j}
            points={pts}
            key={`dot-${j}`}
          />
        ))}
    </>
  )
})
