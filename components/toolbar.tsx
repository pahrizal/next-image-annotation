import clsx from 'clsx'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PointerIcon from '../assets/icons/pointer-icon'
import PolygonIcon from '../assets/icons/polygon-icon'
import RectangleIcon from '../assets/icons/rectangle-icon'
import { AppState } from '../store'
import {
  toolbarActions,
  ToolbarConfig,
  ToolbarName,
} from '../store/toolbar-state'

export const defaultToolbar: ToolbarConfig = {
  pointer: { enable: true, icon: <PointerIcon />, title: 'Select' },
  rectangle: { enable: true, icon: <RectangleIcon />, title: 'Rectangle' },
  polygon: { enable: true, icon: <PolygonIcon />, title: 'Polygon' },
}

const Toolbar = () => {
  const dispatch = useDispatch()
  const busy = useSelector((state: AppState) => state.toolbar.busy)
  const current = useSelector((state: AppState) => state.toolbar.current)
  const toolbars = useSelector((state: AppState) => state.toolbar.toolbars)
  const handleClick = (toolbarName: ToolbarName) => {
    dispatch(toolbarActions.setCurrent(toolbarName))
  }
  return (
    <div
      className={clsx(
        'left-center absolute top-0 flex h-[48px] w-[200px] flex-row items-center justify-center space-x-4 bg-white  p-3 shadow-md'
      )}
    >
      {toolbars &&
        Object.keys(toolbars)
          .map((k) => k as ToolbarName)
          .map((k, i) => {
            const Icon = toolbars[k].icon
            return (
              <a
                key={`toolbar-${i}`}
                onClick={() => handleClick(k)}
                title={toolbars[k].title}
                className={clsx('cursor-pointer hover:text-orange-400', {
                  'text-orange-600': current === k,
                })}
              >
                {Icon}
              </a>
            )
          })}
    </div>
  )
}

export default Toolbar
