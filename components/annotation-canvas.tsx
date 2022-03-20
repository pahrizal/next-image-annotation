import * as React from 'react'
import {
  calculateAspectRatioFit,
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
type Screen = { width: number; height: number }
type WheelOp = 'drag' | 'zoom'
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

const SCROLL_SMOOTHING_VACTOR = 0.3

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
  const [panning, setPanning] = React.useState(false)
  const [annotations, setAnnotations] = React.useState<BaseAnnotation[]>([])
  const [started, setStarted] = React.useState(false)
  const [color, setColor] = React.useState('#FFFFFF')
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [img, setImg] = React.useState<HTMLImageElement | CanvasImageSource>()
  const [wheelOp, setWheelOp] = React.useState<WheelOp>('zoom')
  const [screen, setScreen] = React.useState<Screen>({
    width,
    height,
  })

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
  const handleDoubleClick = (event: KonvaEventObject<MouseEvent>) => {
    if (started) {
      console.log('Adding annotation')
      // escape last points
      let newPoints = points.slice(0, -2)
      setPoints(newPoints)
      setStarted(false)
      // if we have points, store it as a new annotations
      setAnnotations([...annotations, { id: uuid(), color, points: newPoints }])
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
  const handleWheel = (event: KonvaEventObject<WheelEvent>) => {
    event.evt.preventDefault()
    if (stageRef.current !== null) {
      const stage = stageRef.current
      const oldScale = stage.scale()
      const oldPos = stage.position()
      const pointer = stage.getPointerPosition()
      if (!pointer) return
      if (wheelOp === 'zoom') {
        const mousePointTo = {
          x: (pointer.x - stage.x()) / oldScale.x,
          y: (pointer.y - stage.y()) / oldScale.y,
        }
        let newScale =
          event.evt.deltaY > 0
            ? { x: oldScale.x / scaleBy, y: oldScale.y / scaleBy }
            : { x: oldScale.x * scaleBy, y: oldScale.y * scaleBy }
        setStageScale(newScale)
        const newPos = {
          x: pointer.x - mousePointTo.x * newScale.x,
          y: pointer.y - mousePointTo.y * newScale.y,
        }
        stage.position(newPos)
        stage.batchDraw()
      } else if (wheelOp === 'drag') {
        const newPos = {
          x: oldPos.x,
          y: oldPos.y + event.evt.deltaY * SCROLL_SMOOTHING_VACTOR,
        }
        stage.position(newPos)
      }
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
  const applyStageScale = (image: HTMLImageElement | CanvasImageSource) => {
    setImg(image)
    const imageWidth = image.width as number
    const imageHeight = image.width as number
    const bestRatio = calculateAspectRatioFit(
      imageWidth,
      imageHeight,
      screen.width,
      screen.height
    )
    setStageScale({ x: bestRatio, y: bestRatio })
  }

  React.useEffect(() => {
    if (image === undefined) return
    if (typeof image === 'string') {
      preloadImage(image).then((newImg) => {
        applyStageScale(newImg)
      })
    } else {
      applyStageScale(image)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          break
        case 'Control':
          setWheelOp('drag')
          break
      }
    }
    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Control':
          setWheelOp('zoom')
          break
      }
    }
    window.addEventListener('resize', function () {
      setScreen({ width: this.innerWidth, height: this.innerHeight })
    })
    window.addEventListener('keydown', (ev) => handleKeyDown(ev))
    window.addEventListener('keyup', (ev) => handleKeyUp(ev))
    return () => {
      window.removeEventListener('keydown', (ev) => handleKeyDown(ev))
      window.removeEventListener('keyup', (ev) => handleKeyUp(ev))
      window.removeEventListener('resize', function () {
        setScreen({ width: this.innerWidth, height: this.innerHeight })
      })
    }
  }, [])

  React.useEffect(() => {
    stageRef && stageRef.current && stageRef.current.scale(stageScale)
  }, [stageScale])

  // recalculate image size to fit the screen on resize
  React.useEffect(() => {
    if (!img) return
    const imageWidth = img.width as number
    const imageHeight = img.height as number
    const ratio = calculateAspectRatioFit(
      imageWidth,
      imageHeight,
      screen.width,
      screen.height
    )
    setStageScale({ x: ratio, y: ratio })
  }, [screen, img])

  React.useEffect(() => {
    if (!img) return
    if (!stageRef.current) return
    const imgHeight = img.height as number
    const stage = stageRef.current
    const currentPos = stage.getPosition()

    // set stage in center of current view port
    stageRef.current.setPosition({
      ...currentPos,
      y: screen.height / 2 - (imgHeight * stageScale.y) / 2,
    })
  }, [img])

  return (
    <div
      tabIndex={1}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          setStarted(false)
        }
      }}
    >
      <Stage
        className={clsx('bg-slate-400', {
          'cursor-pointer': currentTool === 'pointer',
          'cursor-crosshair':
            currentTool === 'rectangle' || currentTool === 'polygon',
        })}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          ...stageStyle,
        }}
        width={screen.width}
        height={screen.height}
        draggable
        onWheel={handleWheel}
        onTouchMove={handlePanningStart}
        onTouchEnd={handlePanningEnd}
        onMouseMove={handleMouseMove}
        ref={stageRef}
        scale={stageScale}
        onClick={handleClick}
        onDblClick={handleDoubleClick}
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
              strokeWidth={1 / stageScale.x}
            />
          ))}
          {started && (
            <PolygonShape
              strokeWidth={1 / stageScale.x}
              points={points}
              color={'#FFFFFF'}
            />
          )}
        </Layer>
      </Stage>
    </div>
  )
}

export default ImageCanvas
