import Konva from 'konva'
import { RectConfig } from 'konva/lib/shapes/Rect'
import { TextConfig } from 'konva/lib/shapes/Text'
import React from 'react'
import { Rect, Text } from 'react-konva'

type Props = {
  stage?: Konva.Stage
  points?: number[]
  rectColor?: string
  textColor?: string
  text?: string
}
const Label: React.FC<Props> = ({
  points = [0, 0],
  rectColor = '#ffffff',
  textColor = '#000000',
  text = '',
}) => {
  const rectRef = React.useRef<Konva.Rect>(null)
  const textRef = React.useRef<Konva.Text>(null)
  const sortedPoints = [
    Math.min(points[0], points[2]),
    Math.min(points[1], points[3]),
    Math.max(points[0], points[2]),
    Math.max(points[1], points[3]),
  ]
  const rectConfig: RectConfig = {
    x: sortedPoints[0],
    y: sortedPoints[1],
    width: sortedPoints[2] - sortedPoints[0],
    height: 24,
    stroke: rectColor,
    strokeWidth: 0,
    fill: rectColor,
  }
  const textConfig: TextConfig = {
    x:
      sortedPoints[0] +
      (sortedPoints[2] - sortedPoints[0]) / 2 -
      text.length * 7,
    y: sortedPoints[1] + (sortedPoints[3] - sortedPoints[1]) / 2 - 24,
    fontSize: 18,
    fontFamily: 'Calibri',
    fill: '#fff',
    width: rectConfig.width,
    padding: 10,
    text,
    shadowColor: '#000',
    shadowEnabled: true,
    shadowOffset: { x: 0, y: 0 },
    shadowBlur: 3,
  }
  return !text ? (
    <></>
  ) : (
    <>
      {/* <Rect {...rectConfig} ref={rectRef} /> */}
      <Text {...textConfig} ref={textRef} />
    </>
  )
}

export default Label
