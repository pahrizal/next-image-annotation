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
type WheelOp = 'drag' | 'zoom'
type ImageList = CanvasImageSource | string

const SCROLL_SMOOTHING_VACTOR = 0.3
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
  const hotkeyHandlers = {
    PAN: () => setWheelOp('drag'),
    ZOOM: () => setWheelOp('zoom'),
    NEXT_IMAGE: () => dispatch(AnnotationActions.nextImage()),
    PREV_IMAGE: () => dispatch(AnnotationActions.previousImage()),
  }

  const handleClick = (event: KonvaEventObject<MouseEvent>) => {
    const stage = event.target.getStage()
    if (!stage) return
    if (!started && !selectedId && currentToolbar === 'polygon') {
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
      // escape last points
      let newPoints = points.slice(0, -2)
      setPoints(newPoints)
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

      preloadImage(currentAnnotation.imageData).then((newImg) => {
        setImg(newImg)
      })
    }
  }, [currentImageIndex, annotations])

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
    //TODO: set stage in center of current view port. Need to fix this (for now we force the zoom to fit the viewport)
    const ratio = screen.height / imageHeight
    setStageScale({ x: ratio, y: ratio })
  }, [screen, img])

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
            onDblClick={handleDoubleClick}
          >
            <Layer id="image-layer">
              <KonvaImage ref={imageRef} image={img} />
            </Layer>
            <Layer>
              {annotations[currentImageIndex].annotations
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
                    color={a.color}
                    dotSize={4 / stageScale.x}
                    strokeWidth={1 / stageScale.x}
                  />
                ))}
              {started && (
                <Polygon
                  strokeWidth={1 / stageScale.x}
                  points={points}
                  color={'#FFFFFF'}
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

export default React.memo(AnnotationCanvas)
