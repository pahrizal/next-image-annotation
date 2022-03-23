import * as React from 'react';
import Konva from 'konva';
import {Rect} from 'react-konva';
import ResizerHelperCircle from './ResizeCircle'
import { getPointChunk } from './helper'
import Label from './Label'
import { useSelector } from 'react-redux'
import { AppState } from '../../store'

type Props = {
  id: string | null
  points: number[]
  fillColor?: string
  strokeColor?: string
  strokeWidth?: number
  selected?: boolean
  dotSize?: number
  onResize?: (id: string | null, points: number[]) => void
  onSelect?: () => void
  label?: string
  onLabelEdit?: (label: string | null) => void
}
const RectangleShape: React.FC<Props> = ({
  id,
  points,
  fillColor = '#83CC1844',
  strokeColor = '#83CC18',
  strokeWidth = 4,
  selected,
  dotSize = 8,
  onResize,
  onSelect,
  label,
  onLabelEdit,
}) => {
  const ref = React.useRef<Konva.Rect>(null)
  const [newPoints, setNewPoints] = React.useState(points)
  const [showLabel, setShowLabel] = React.useState(false)
  const [resizerPoint, setResizerPoint] = React.useState([
    [points[0], points[1]], // top-left
    [points[2], points[1]], // top-right
    [points[2], points[3]], // bottom-right
    [points[0], points[3]], // bottom-left
  ])
  const handleResize = (id: number, pos: number[]) => {
    if (!ref.current) return points
    const rect = ref.current
    if (id === 0) {
      //top-left
      rect.x(pos[0])
      rect.y(pos[1])
      rect.width(points[2] - rect.x())
      rect.height(points[3] - rect.y())
    } else if (id === 1) {
      // top-right
      rect.x(points[0])
      rect.y(pos[1])
      rect.width(pos[0] - rect.x())
      rect.height(points[3] - rect.y())
    } else if (id === 2) {
      //bottom-right
      rect.x(points[0])
      rect.y(points[1])
      rect.width(pos[0] - rect.x())
      rect.height(pos[1] - rect.y())
    } else {
      // bottom-left
      rect.x(pos[0])
      rect.y(points[1])
      rect.width(points[2] - rect.x())
      rect.height(pos[1] - rect.y())
    }
    const npoints = [
      rect.x(),
      rect.y(),
      rect.x() + rect.width(),
      rect.y() + rect.height(),
    ]
    setResizerPoint([
      [npoints[0], npoints[1]], // top-left
      [npoints[2], npoints[1]], // top-right
      [npoints[2], npoints[3]], // bottom-right
      [npoints[0], npoints[3]], // bottom-left
    ])
    setNewPoints(npoints)
    return npoints
  }
  const editLabel = () => {
    const newLabel = prompt('new label', label)
    onLabelEdit && onLabelEdit(newLabel)
  }
  return (
    <>
      <Rect
        ref={ref}
        fill={fillColor}
        strokeWidth={strokeWidth}
        x={points[0]}
        y={points[1]}
        width={points[2] - points[0]}
        height={points[3] - points[1]}
        stroke={strokeColor}
        onMouseEnter={() => setShowLabel(true)}
        onMouseLeave={() => setShowLabel(false)}
        onClick={() => onSelect && onSelect()}
        onDblClick={() => editLabel()}
      />
      {selected &&
        resizerPoint.map((point, i) => (
          <ResizerHelperCircle
            onDragMove={(id, pos) => {
              handleResize(id, pos)
            }}
            onDragEnd={(i, pos) => {
              const npoints = handleResize(i, pos)
              onResize && onResize(id, npoints)
            }}
            size={dotSize}
            pointIdx={i}
            points={point}
            key={`dot-${i}`}
            strokeWidth={strokeWidth}
          />
        ))}
      {label && (selected || showLabel) && (
        <Label text={label} points={newPoints} />
      )}
    </>
  )
}

export default RectangleShape;