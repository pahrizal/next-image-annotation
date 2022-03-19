import * as React from 'react'
import {
  getCenter,
  getDistance,
  isTouchEnabled,
  preloadImage,
} from '../utils/helper'
import PolygonShape from './polygon'
import { Vector2d } from 'konva/lib/types'
import { Stage as StageType } from 'konva/lib/Stage'
import { KonvaEventObject } from 'konva/lib/Node'
import randomColor from 'randomcolor'
import uuid from 'uuid/v1'
import Konva from 'konva'
import { Layer, Stage, Image as KonvaImage } from 'react-konva'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../store'
import clsx from 'clsx'
import { toolbarActions } from '../store/toolbar-state'

type Props = {
  width?: number
  height?: number
  image?: CanvasImageSource | string
  stageStyle?: React.CSSProperties
  scaleBy?: number
}
interface BaseAnnotation {
  id: string
  color: string
  points: number[]
}
const ImageCanvas: React.FC<Props> = ({
  width = window.innerWidth,
  height = window.innerHeight,
  stageStyle,
  scaleBy = 1.05,
  image,
}) => {
  const dispatch = useDispatch()
  const currentTool = useSelector((state: AppState) => state.toolbar.current)
  const stageRef = React.useRef<StageType>(null)
  const imageRef = React.useRef<Konva.Image>(null)
  const [lastCenter, setLastCenter] = React.useState<Vector2d | null>(null)
  const [lastDist, setLastDist] = React.useState<number>(0)
  const [stageScale, setStageScale] = React.useState<Vector2d>({
    x: 1,
    y: 1,
  })
  const [points, setPoints] = React.useState<number[]>([])
  const [cursorPos, setCursorPos] = React.useState<[number, number]>([0, 0])
  const [isMouseOverStartPoint, setIsMouseOverStartPoint] =
    React.useState(false)
  const [isFinished, setIsFinished] = React.useState(false)
  const [drawing, setDrawing] = React.useState(false)
  const [panning, setPanning] = React.useState(false)
  const [annotations, setAnnotations] = React.useState<BaseAnnotation[]>([])
  const [started, setStarted] = React.useState(false)
  const [color, setColor] = React.useState('#FFFFFF')
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [img, setImg] = React.useState<HTMLImageElement | CanvasImageSource>()

  const handleClick = (event: KonvaEventObject<MouseEvent>) => {
    const stage = event.target.getStage()
    if (!stage) return
    if (!started && !selectedId && currentTool === 'polygon') {
      // this is the first click
      const scale = stage.scaleX()
      const pointer = stage.getPointerPosition()
      if (!pointer) return
      setPoints(cursorPos)
      setStarted(true)
      dispatch(toolbarActions.setBusy(true))
      setColor(randomColor())
    } else {
      let prevPoints = points.slice(0, -2)
      if (prevPoints.length === 0) {
        prevPoints = points
      }
      started && setPoints([...points, ...cursorPos])
    }
    // if clicked outside annotation shape, close the shape
    if (selectedId && imageRef.current && event.target === imageRef.current) {
      setSelectedId(null)
      dispatch(toolbarActions.setBusy(false))
    }
  }
  const handleMouseMove = (event: KonvaEventObject<MouseEvent>) => {
    const stage = event.target.getStage()
    if (!stage) return
    const scale = stage.scaleX()
    const pointer = stage.getPointerPosition()
    if (!pointer) return
    const mousePointTo = {
      x: (pointer.x - stage.x()) / stage.scaleX(),
      y: (pointer.y - stage.y()) / stage.scaleY(),
    }
    setCursorPos([mousePointTo.x, mousePointTo.y])

    if (started && points.length > 0) {
      const { x, y } = mousePointTo
      let prevPoints = points.slice(0, -2)
      if (prevPoints.length === 0) {
        prevPoints = points
      }
      setPoints([...prevPoints, x, y])
    }
  }
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (started && event.key === 'Escape') {
      // escape last points
      let newPoints = points.slice(0, -2)
      setPoints(newPoints)
      setStarted(false)
      // if we have points, store it as a new annotations
      setAnnotations([...annotations, { id: uuid(), color, points: newPoints }])
    }
  }

  const zoomStage = (event: KonvaEventObject<WheelEvent>) => {
    event.evt.preventDefault()
    if (stageRef.current !== null) {
      const stage = stageRef.current
      const oldScale = stage.scale()
      const pointer = stage.getPointerPosition()
      if (!pointer) return
      const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale.x,
        y: (pointer.y - stage.y()) / oldScale.y,
      }
      let newScale =
        event.evt.deltaY > 0
          ? { x: oldScale.x / scaleBy, y: oldScale.y / scaleBy }
          : { x: oldScale.x * scaleBy, y: oldScale.y * scaleBy }
      if (
        newScale.x < width / (img!!.width as number) ||
        newScale.y < height / (img!!.height as number)
      ) {
        newScale.x = width / (img!!.width as number)
        newScale.y = height / (img!!.height as number)
      }
      setStageScale(newScale)
      const newPos = {
        x: pointer.x - mousePointTo.x * newScale.x,
        y: pointer.y - mousePointTo.y * newScale.y,
      }
      stage.position(newPos)
      stage.batchDraw()
    }
  }

  const handlePanningStart = (e: KonvaEventObject<TouchEvent>) => {
    e.evt.preventDefault()
    setPanning(true)
    var touch1 = e.evt.touches[0]
    var touch2 = e.evt.touches[1]
    const stage = stageRef.current
    if (stage !== null) {
      if (touch1 && touch2) {
        stage.container().style.cursor = 'pointer'
        if (stage.isDragging()) {
          stage.stopDrag()
        }

        const p1 = {
          x: touch1.clientX,
          y: touch1.clientY,
        }
        const p2 = {
          x: touch2.clientX,
          y: touch2.clientY,
        }

        if (!lastCenter) {
          setLastCenter(getCenter(p1, p2))
          return
        }
        const newCenter = getCenter(p1, p2)

        const dist = getDistance(p1, p2)

        if (!lastDist) {
          setLastDist(dist)
        }

        // local coordinates of center point
        var pointTo = {
          x: (newCenter.x - stage.x()) / stage.scaleX(),
          y: (newCenter.y - stage.y()) / stage.scaleX(),
        }

        var scale = stage.scaleX() * (dist / lastDist)

        stage.scaleX(scale)
        stage.scaleY(scale)

        // calculate new position of the stage
        var dx = newCenter.x - lastCenter.x
        var dy = newCenter.y - lastCenter.y

        var newPos = {
          x: newCenter.x - pointTo.x * scale + dx,
          y: newCenter.y - pointTo.y * scale + dy,
        }

        stage.position(newPos)
        stage.batchDraw()

        setLastDist(dist)
        setLastCenter(newCenter)
      }
    }
  }

  const handlePanningEnd = () => {
    const stage = stageRef.current
    if (stage) {
      stage.container().style.cursor = 'default'
    }
    setLastCenter(null)
    setLastDist(0)
    setPanning(false)
  }

  React.useEffect(() => {
    if (image === undefined) return
    if (typeof image === 'string') {
      preloadImage(image).then((newImg) => {
        setImg(newImg)
        setStageScale({ x: width / newImg.width, y: height / newImg.height })
      })
    } else {
      setImg(image)
      const imageWidth = image.width as number
      const imageHeight = image.width as number
      setStageScale({ x: width / imageWidth, y: height / imageHeight })
    }
  }, [])

  React.useEffect(() => {
    stageRef && stageRef.current && stageRef.current.scale(stageScale)
  }, [stageScale])

  return (
    <div tabIndex={1} onKeyDown={handleKeyDown}>
      <Stage
        className={clsx({
          'cursor-pointer': currentTool === 'pointer',
          'cursor-crosshair':
            currentTool === 'rectangle' || currentTool === 'polygon',
        })}
        style={{
          backgroundColor: '#000',
          position: 'absolute',
          left: 0,
          top: 0,
          ...stageStyle,
        }}
        width={width}
        height={height}
        draggable={!isTouchEnabled() && currentTool === 'pointer'}
        onWheel={zoomStage}
        onTouchMove={handlePanningStart}
        onTouchEnd={handlePanningEnd}
        // onMouseDown={handleClick}
        onMouseMove={handleMouseMove}
        ref={stageRef}
        scale={stageScale}
        onClick={handleClick}
      >
        <Layer id="image-layer">
          <KonvaImage ref={imageRef} image={img} />
        </Layer>
        <Layer>
          {annotations.map((a, i) => (
            <PolygonShape
              onSelect={() => setSelectedId(a.id)}
              selected={a.id === selectedId}
              onResize={(newPoints) => {
                const newAnnotations = [
                  ...annotations.filter((ann) => ann.id !== a.id),
                  { ...a, points: newPoints },
                ]
                setAnnotations(newAnnotations)
              }}
              key={i}
              points={a.points}
              color={a.color}
              dotSize={4 / stageScale.x}
            />
          ))}
          {started && <PolygonShape points={points} color={'#FFFFFF'} />}
        </Layer>
      </Stage>
    </div>
  )
}

export default ImageCanvas
