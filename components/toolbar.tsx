import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'
import { GlobalHotKeys } from 'react-hotkeys'
import { useDispatch, useSelector } from 'react-redux'
import NextIcon from '../assets/icons/next-icon'
import PointerIcon from '../assets/icons/pointer-icon'
import PolygonIcon from '../assets/icons/polygon-icon'
import PrevIcon from '../assets/icons/prev-icon'
import RectangleIcon from '../assets/icons/rectangle-icon'
import ThumbnailIcon from '../assets/icons/thumbnail-icon'
import UploadIcon from '../assets/icons/upload-icon'
import { AppState } from '../store'
import { actions as AnnotationActions } from '../store/annotationState'
import {
  toolbarActions,
  ToolbarConfig,
  ToolbarName,
} from '../store/toolbarState'
import { toolbarHotkeymap } from './annotations/hotkey'

const Toolbar = () => {
  const dispatch = useDispatch()
  const busy = useSelector((state: AppState) => state.toolbar.busy)
  const current = useSelector((state: AppState) => state.toolbar.current)
  const hotkeyHandlers = {
    TOOLBAR_UPLOAD: () => dispatch(toolbarActions.setCurrent('upload')),
    TOOLBAR_POINTER: () => dispatch(toolbarActions.setCurrent('pointer')),
    TOOLBAR_POLYGON: () => dispatch(toolbarActions.setCurrent('polygon')),
    TOOLBAR_TOOGLE_THUMBNAIL: () => dispatch(toolbarActions.toggleThumbnail()),
    NEXT_IMAGE: () => dispatch(AnnotationActions.nextImage()),
    PREV_IMAGE: () => dispatch(AnnotationActions.previousImage()),
  }

  const toolbars: ToolbarConfig = {
    upload: {
      enable: true,
      icon: <UploadIcon width={32} />,
      title: 'Upload',
      shortcut: '0',
      handler: hotkeyHandlers.TOOLBAR_UPLOAD,
    },
    pointer: {
      enable: true,
      icon: <PointerIcon width={32} />,
      title: 'Select',
      shortcut: '1',
      handler: hotkeyHandlers.TOOLBAR_POINTER,
    },
    polygon: {
      enable: true,
      icon: <PolygonIcon width={32} />,
      title: 'Polygon',
      shortcut: '2',
      handler: hotkeyHandlers.TOOLBAR_POLYGON,
    },
    rectangle: {
      enable: true,
      title: 'Rectangle',
      shortcut: '3',
      icon: <RectangleIcon width={36} />,
    },
    thumbnail: {
      enable: true,
      title: 'Toggle Thumbnail',
      shortcut: '4',
      icon: <ThumbnailIcon width={32} />,
      handler: hotkeyHandlers.TOOLBAR_TOOGLE_THUMBNAIL,
    },
    previous: {
      enable: true,
      title: 'Previous Image',
      shortcut: 'a',
      icon: <PrevIcon width={32} />,
      handler: hotkeyHandlers.PREV_IMAGE,
    },
    next: {
      enable: true,
      title: 'Next Image',
      shortcut: 'd',
      icon: <NextIcon width={32} />,
      handler: hotkeyHandlers.NEXT_IMAGE,
    },
  }

  return (
    <GlobalHotKeys keyMap={toolbarHotkeymap} handlers={hotkeyHandlers}>
      <div
        className={clsx(
          'left-center absolute top-1 flex  flex-row items-center justify-center rounded-xl border bg-white  px-[16px] shadow'
        )}
      >
        {Object.keys(toolbars)
          .map((k) => k as ToolbarName)
          .map((k, i) => {
            const toolbar = toolbars[k]
            return toolbar.enable ? (
              toolbar.href ? (
                <Link href={toolbar.href}>
                  <div
                    className={clsx(
                      'flex h-[56px] w-[56px] cursor-pointer items-center justify-center px-3 text-black hover:bg-blue-600 hover:text-white',
                      {
                        'bg-blue-600 text-white': current === k,
                      }
                    )}
                  >
                    {toolbar.icon}
                  </div>
                </Link>
              ) : (
                <div
                  key={`toolbar-${i}`}
                  onClick={toolbar.handler}
                  title={toolbar.title}
                  className={clsx(
                    'relative flex h-[48px] w-[48px] cursor-pointer items-center justify-center text-black hover:bg-blue-600 hover:text-white',
                    {
                      'bg-blue-600 text-white': current === k,
                    }
                  )}
                >
                  {toolbar.icon}
                  <div
                    className={clsx(
                      'absolute bottom-[2px] right-[3px] flex h-[18px] w-[18px] items-center justify-center rounded-full bg-slate-600 p-1 text-xs font-bold text-white',
                      {
                        'bg-slate-100 text-slate-900': current === k,
                      }
                    )}
                  >
                    {toolbar.shortcut}
                  </div>
                </div>
              )
            ) : (
              <></>
            )
          })}
      </div>
    </GlobalHotKeys>
  )
}

export default Toolbar
