import * as React from 'react'
import {
  calculateAspectRatioFit,
  getCenter,
  getDistance,
  isTouchEnabled,
  preloadImage,
} from '../../utils/helper'
import { Vector2d } from 'konva/lib/types'
import { Stage as StageType } from 'konva/lib/Stage'
import { KonvaEventObject } from 'konva/lib/Node'
import randomColor from 'randomcolor'
import uuid from 'uuid/v1'
import Konva from 'konva'
import { Layer, Stage, Image as KonvaImage } from 'react-konva'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../../store'
import clsx from 'clsx'
import { toolbarActions } from '../../store/toolbarState'
import { annotationHotKeyMap } from './hotkey'
import Toolbar from '../toolbar'
import { GlobalHotKeys, HotKeys } from 'react-hotkeys'
import {
  actions as AnnotationActions,
  ImageAnnotation,
} from '../../store/annotationState'
import Thumbnail from './Thumbnail'
import UploadIcon from '../../assets/icons/upload-icon'
import ImageUploader from './ImageUploader'
import Polygon from './PolygonShape'
type Screen = { width: number; height: number }
type WheelOp = 'pan-x' | 'pan-y' | 'zoom'
type ImageList = CanvasImageSource | string

const SCROLL_SMOOTHING_VACTOR = 0.3
function intersection(
  x0: number,
  y0: number,
  r0: number,
  x1: number,
  y1: number,
  r1: number
) {
  var a, dx, dy, d, h, rx, ry
  var x2, y2

  /* dx and dy are the vertical and horizontal distances between
   * the circle centers.
   */
  dx = x1 - x0
  dy = y1 - y0

  /* Determine the straight-line distance between the centers. */
  d = Math.sqrt(dy * dy + dx * dx)

  /* Check for solvability. */
  if (d > r0 + r1) {
    /* no solution. circles do not intersect. */
    return false
  }

  if (d < Math.abs(r0 - r1)) {
    /* one circle is contained in the other */
    return true
  }
  return false
}
type Props = {
  width?: number
  height?: number
  images?: string[]
  stageStyle?: React.CSSProperties
  scaleBy?: number
  uploadUrl?: string
}

const AnnotationCanvas: React.FC<Props> = ({
  width = window.innerWidth,
  height = window.innerHeight,
  stageStyle,
  scaleBy = 1.05,
  images: imagesProp = [],
  uploadUrl,
}) => {
  const dispatch = useDispatch()
  const currentToolbar = useSelector((state: AppState) => state.toolbar.current)
  const annotations = useSelector(
    (state: AppState) => state.annotation.annotations
  )
  const currentImageIndex = useSelector(
    (state: AppState) => state.annotation.currentIndex
  )
  const points = useSelector(
    (state: AppState) => state.annotation.currentPoints
  )
  const stageRef = React.useRef<StageType>(null)
  const imageRef = React.useRef<Konva.Image>(null)
  const [lastCenter, setLastCenter] = React.useState<Vector2d | null>(null)
  const [lastDist, setLastDist] = React.useState<number>(0)
  const [stageScale, setStageScale] = React.useState<Vector2d>({
    x: 1,
    y: 1,
  })
  //   const [points, setPoints] = React.useState<number[]>([])
  const [cursorPos, setCursorPos] = React.useState<[number, number]>([0, 0])
  const [panning, setPanning] = React.useState(false)
  const [started, setStarted] = React.useState(false)
  const [color, setColor] = React.useState('#FFFFFF')
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [img, setImg] = React.useState<HTMLImageElement | CanvasImageSource>()
  //   const [currentImageIndex, setCurrentImageIndex] = React.useState(0)
  const [wheelOp, setWheelOp] = React.useState<WheelOp>('zoom')
  const [screen, setScreen] = React.useState<Screen>({
    width,
    height,
  })

  const handleClick = (event: KonvaEventObject<MouseEvent>) => {
    const stage = event.target.getStage()
    if (!stage) return
    if (!started && !selectedId && currentToolbar === 'polygon') {
      // this is the first click
      const scale = stage.scaleX()
      const pointer = stage.getPointerPosition()
      if (!pointer) return
      dispatch(AnnotationActions.setCurrentPoints(cursorPos))
      setStarted(true)
      dispatch(toolbarActions.setBusy(true))
      setColor(randomColor())
    } else {
      let prevPoints = points.slice(0, -2)
      if (prevPoints.length === 0) {
        prevPoints = points
      }
      // check if current point is in starting point
      const radius = 4 / stageScale.x
      const isAtStartPoint = intersection(
        points[0],
        points[1],
        radius,
        cursorPos[0],
        cursorPos[1],
        12 / stageScale.x
      )
      if (isAtStartPoint) {
        finishDrawing()
      } else {
        started && dispatch(AnnotationActions.addPoints(cursorPos))
      }
    }
    // if clicked outside annotation shape, close the shape
    if (selectedId && imageRef.current && event.target === imageRef.current) {
      setSelectedId(null)
      dispatch(toolbarActions.setBusy(false))
    }
  }
  const finishDrawing = React.useCallback(() => {
    if (started) {
      // escape last points
      let newPoints = points.slice(0, -2)
      dispatch(AnnotationActions.setCurrentPoints(newPoints))
      setStarted(false)
      // if we have points, store it as a new annotations
      const currentAnnotation = annotations[currentImageIndex]
      currentAnnotation.annotations.push({
        id: uuid(),
        points: newPoints,
        type: 'polygon',
        color,
      })
      const newAnnotations = [
        ...annotations.filter((a) => a.id !== currentAnnotation.id),
        currentAnnotation,
      ].sort((a, b) => a.id.localeCompare(b.id))
      dispatch(AnnotationActions.setAnnotations(newAnnotations))
    }
  }, [started, points, annotations[currentImageIndex]])

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
      dispatch(AnnotationActions.setCurrentPoints([...prevPoints, x, y]))
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
      } else if (wheelOp === 'pan-y') {
        const newPos = {
          x: oldPos.x,
          y: oldPos.y + event.evt.deltaY * SCROLL_SMOOTHING_VACTOR,
        }
        stage.position(newPos)
      } else if (wheelOp === 'pan-x') {
        const newPos = {
          x: oldPos.x + event.evt.deltaY * SCROLL_SMOOTHING_VACTOR,
          y: oldPos.y,
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
    const imageWidth = image.width as number
    const imageHeight = image.width as number
    const bestRatio = calculateAspectRatioFit(
      imageWidth,
      imageHeight,
      screen.width,
      screen.height
    )
    setStageScale({ x: bestRatio, y: bestRatio })
    setImg(image)
  }
  React.useEffect(() => {
    if (annotations.length > 0 && currentImageIndex >= 0) {
      const currentAnnotation = annotations[currentImageIndex]
      if (!currentAnnotation) return
      preloadImage(currentAnnotation.imageData).then((newImg) => {
        setImg(newImg)
      })
    }
  }, [annotations[currentImageIndex]])

  React.useEffect(() => {
    if (imagesProp.length > 0) {
      const newAnnotations: ImageAnnotation[] = imagesProp.map((img) => ({
        id: uuid(),
        imageData: img,
        annotations: [],
      }))
      dispatch(AnnotationActions.setAnnotations(newAnnotations))
    }
    window.addEventListener('resize', function () {
      setScreen({ width: this.innerWidth, height: this.innerHeight })
    })
    return () => {
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
    if (!stageRef.current) return
    const imageWidth = img.width as number
    const imageHeight = img.height as number
    const stage = stageRef.current
    const currentPos = stage.getPosition()
    const minScreenSize = Math.min(screen.width, screen.height)
    const minMediaSize = Math.min(imageWidth, imageHeight)
    setStageScale({
      x: minScreenSize / minMediaSize,
      y: minScreenSize / minMediaSize,
    })
  }, [screen, img, currentImageIndex])

  const hotkeyHandlers = {
    PAN_Y: () => setWheelOp('pan-y'),
    PAN_X: () => setWheelOp('pan-x'),
    ZOOM: () => setWheelOp('zoom'),
    NEXT_IMAGE: () => dispatch(AnnotationActions.nextImage()),
    PREV_IMAGE: () => dispatch(AnnotationActions.previousImage()),
    CANCEL: () => setStarted(false),
    UNDO: () => dispatch(AnnotationActions.undoLastPoints()),
    TOOLBAR_UPLOAD: () => dispatch(toolbarActions.setCurrent('upload')),
    TOOLBAR_POINTER: () => dispatch(toolbarActions.setCurrent('pointer')),
    TOOLBAR_POLYGON: () => dispatch(toolbarActions.setCurrent('polygon')),
  }

  return (
    <div className="fixed flex h-screen w-screen flex-col items-center justify-center bg-white">
      {annotations.length > 0 && currentToolbar !== 'upload' && (
        <GlobalHotKeys keyMap={annotationHotKeyMap} handlers={hotkeyHandlers}>
          <Stage
            className={clsx({
              'cursor-pointer': currentToolbar === 'pointer',
              'cursor-crosshair':
                currentToolbar === 'rectangle' || currentToolbar === 'polygon',
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
          >
            <Layer id="image-layer">
              <KonvaImage ref={imageRef} image={img} />
            </Layer>
            <Layer>
              {annotations.length > currentImageIndex &&
                annotations[currentImageIndex].annotations
                  .filter((a) => a.type === 'polygon')
                  .map((a, i) => (
                    <Polygon
                      onSelect={() => setSelectedId(a.id)}
                      selected={a.id === selectedId}
                      onResize={(newPoints) => {
                        const currentAnnotation = annotations[currentImageIndex]
                        const newPolygon = currentAnnotation.annotations.find(
                          (x) => x.id === a.id
                        )
                        if (newPolygon) {
                          newPolygon.points = newPoints
                          dispatch(
                            AnnotationActions.setAnnotations([
                              ...annotations.filter(
                                (xx) => xx.id !== currentAnnotation.id
                              ),
                              {
                                ...currentAnnotation,
                                annotations: [
                                  ...currentAnnotation.annotations.filter(
                                    (aaa) => aaa.id !== a.id
                                  ),
                                  newPolygon,
                                ],
                              },
                            ])
                          )
                        }
                      }}
                      key={i}
                      points={a.points}
                      strokeColor={a.color}
                      fillColor={`${a.color}55`}
                      dotSize={4 / stageScale.x}
                      strokeWidth={2 / stageScale.x}
                    />
                  ))}
              {started && (
                <Polygon
                  strokeWidth={2 / stageScale.x}
                  points={points}
                  dotSize={4 / stageScale.x}
                  strokeColor={'#83CC18'}
                  fillColor={'#83CC1844'}
                  showResizer
                />
              )}
            </Layer>
          </Stage>
          <Thumbnail />
          <Toolbar />
        </GlobalHotKeys>
      )}
      {(annotations.length === 0 || currentToolbar === 'upload') && (
        <div>
          <ImageUploader
            targetUrl={uploadUrl}
            onComplete={(files) => {
              const newAnnotations: ImageAnnotation[] = files.map((f) => ({
                id: uuid(),
                imageData: f,
                annotations: [],
              }))
              dispatch(
                AnnotationActions.setAnnotations([
                  ...annotations,
                  ...newAnnotations,
                ])
              )
            }}
          />
        </div>
      )}
    </div>
  )
}

export default AnnotationCanvas
