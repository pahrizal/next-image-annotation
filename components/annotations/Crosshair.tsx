import React from 'react'
import Konva from 'konva'
import { Layer, Line } from 'react-konva'

type Props = {
  stage: Konva.Stage
  dashSize?: number[]
  points?: number[]
  strokeWidth?: number
  strokeColor?: string
}
const Crosshair: React.FC<Props> = ({
  stage,
  dashSize = [4, 4],
  points = [0, 0],
  strokeWidth = 4,
  strokeColor = '#82CB19',
}) => {
  return (
    <Layer id="crosshair">
      <Line
        dash={dashSize}
        points={[
          (stage.x() / stage.scaleX()) * -1,
          points[1],
          Math.max(stage.width() / stage.scaleX(), stage.width()),
          points[1],
        ]}
        fill={strokeColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      <Line
        dash={dashSize}
        points={[
          points[0],
          (stage.y() / stage.scaleY()) * -1,
          points[0],
          Math.max(stage.height() / stage.scaleY(), stage.height()),
        ]}
        fill={strokeColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
    </Layer>
  )
}

export default Crosshair
