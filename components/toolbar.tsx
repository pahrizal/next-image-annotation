import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PointerIcon from '../assets/icons/pointer-icon'
import PolygonIcon from '../assets/icons/polygon-icon'
import RectangleIcon from '../assets/icons/rectangle-icon'
import UploadIcon from '../assets/icons/upload-icon'
import { AppState } from '../store'
import {
  toolbarActions,
  ToolbarConfig,
  ToolbarName,
} from '../store/toolbarState'

export const toolbars: ToolbarConfig = {
  upload: {
    enable: true,
    icon: <UploadIcon width={32} />,
    title: 'Upload',
    href: '/upload',
  },
  pointer: { enable: true, icon: <PointerIcon width={32} />, title: 'Select' },
  polygon: {
    enable: true,
    icon: <PolygonIcon width={32} />,
    title: 'Polygon',
  },
  rectangle: {
    enable: false,
    title: 'Rectangle',
    icon: <RectangleIcon width={32} />,
  },
}

const Toolbar = () => {
  const dispatch = useDispatch()
  const busy = useSelector((state: AppState) => state.toolbar.busy)
  const current = useSelector((state: AppState) => state.toolbar.current)
  const handleClick = (toolbarName: ToolbarName) => {
    dispatch(toolbarActions.setCurrent(toolbarName))
  }
  return (
    <div
      className={clsx(
        'left-center absolute top-1 flex h-[48px]  flex-row items-center justify-center rounded-xl border bg-white  px-[16px] shadow'
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
                    'flex h-[48px] w-[48px] cursor-pointer items-center justify-center px-3 text-black hover:bg-blue-600 hover:text-white',
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
                onClick={() => handleClick(k)}
                title={toolbar.title}
                className={clsx(
                  'flex h-[48px] w-[48px] cursor-pointer items-center justify-center px-3 text-black hover:bg-blue-600 hover:text-white',
                  {
                    'bg-blue-600 text-white': current === k,
                  }
                )}
              >
                {toolbar.icon}
              </div>
            )
          ) : (
            <></>
          )
        })}
    </div>
  )
}

export default Toolbar
