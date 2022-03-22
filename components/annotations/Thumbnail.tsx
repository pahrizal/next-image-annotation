import clsx from 'clsx'
import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CloseIcon from '../../assets/icons/close-icon'
import { AppState } from '../../store'
import { actions } from '../../store/annotationState'
import { toolbarActions } from '../../store/toolbarState'
import ImagePreview from '../ImagePreview'

type Props = {
  position?: 'top' | 'right' | 'bottom' | 'left'
}

const Thumbnail: React.FC<Props> = ({ position = 'bottom' }) => {
  const annotations = useSelector(
    (state: AppState) => state.annotation.annotations
  )
  const currentIndex = useSelector(
    (state: AppState) => state.annotation.currentIndex
  )
  const show = useSelector((state: AppState) => state.toolbar.thumbnail)
  const dispatch = useDispatch()
  const container = React.useRef<HTMLDivElement>(null)
  const handleClose = () => {
    dispatch(toolbarActions.toggleThumbnail())
  }
  return show ? (
    <div
      ref={container}
      className={clsx('fixed flex overflow-hidden border bg-slate-700', {
        'top-0 w-screen flex-row': position === 'top',
        'right-0 h-screen flex-col': position === 'right',
        'bottom-0 w-screen flex-row': position === 'bottom',
        'left-0 h-screen flex-col': position === 'left',
      })}
    >
      {annotations.map((annotation, i) => (
        <ImagePreview
          onHighlight={(el) => {
            if (!container.current) return
            // TODO: auto scroll on hotkey is not implemented for other position
            // Scroll image thumbnail on hotkey for position = 'bottom'
            if (
              container.current.scrollLeft + container.current.offsetWidth <
              el.offsetLeft + el.offsetWidth
            ) {
              container.current.scrollLeft =
                el.offsetLeft + el.offsetWidth - container.current.offsetWidth
            } else if (container.current.scrollLeft < el.offsetLeft) {
              container.current.scrollLeft -= el.offsetWidth
            } else if (container.current.scrollLeft > el.offsetLeft) {
              container.current.scrollLeft = 0
            }
          }}
          onClick={() => dispatch(actions.setCurrentIndex(i))}
          selected={currentIndex === i}
          image={annotation.imageData}
        />
      ))}
    </div>
  ) : (
    <></>
  )
}

export default Thumbnail
