import { useRef } from 'react'
import Konva from 'konva'
import { Circle } from 'react-konva'

type Props = {
  pointIdx: number
  points: number[]
  size?: number
  strokeWidth?: number
  onDragMove: (idx: number, pos: number[]) => void
  onDragEnd: (idx: number, pos: number[]) => void
}
export default function ResizeCircle({
  pointIdx,
  points,
  size = 4,
  onDragMove,
  onDragEnd,
  strokeWidth = 1,
}: Props) {
  const ref = useRef<Konva.Circle>(null)
  return (
    <Circle
      ref={ref}
      draggable
      x={points[0]}
      y={points[1]}
      fill="transparent"
      stroke="white"
      strokeWidth={strokeWidth}
      radius={size}
      onMouseEnter={(e) => {
        e.target.getStage()!!.container().style.cursor = 'pointer'
      }}
      onMouseLeave={(e) => {
        e.target.getStage()!!.container().style.cursor = 'default'
        ref.current!!.fill('transparent')
      }}
      onDragMove={(e) => {
        const newPos = [e.target.x(), e.target.y()]
        onDragMove && onDragMove(pointIdx, newPos)
      }}
      onDragEnd={(e) => {
        const newPos = [e.target.x(), e.target.y()]
        onDragEnd && onDragEnd(pointIdx, newPos)
      }}
    />
  )
}
