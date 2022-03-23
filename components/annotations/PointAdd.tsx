import React from 'react'
import { Circle } from 'react-konva'
type Props = {
  points: number[]
  size?: number
  strokeWidth?: number
  draggable?: boolean
  onClick?: (points: number[]) => void
}
const PointAdd: React.FC<Props> = ({
  points,
  size = 4,
  strokeWidth = 1,
  draggable = true,
  onClick,
}) => {
  return (
    <Circle
      fill="transparent"
      stroke="#83CC18"
      strokeWidth={strokeWidth}
      radius={size}
      dash={[size / 3, size / 3]}
      onClick={(e) => {
        const pos = e.target.getPosition()
        onClick && onClick([pos.x, pos.y])
      }}
      onMouseEnter={(e) => {
        e.target.getStage()!!.container().style.cursor = 'copy'
      }}
      onMouseLeave={(e) => {
        e.target.getStage()!!.container().style.cursor = 'default'
      }}
      x={points[0]}
      y={points[1]}
    />
  )
}

export default PointAdd
