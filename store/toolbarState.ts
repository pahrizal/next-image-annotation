import React from 'react'
import { Reducer } from 'redux'
import { ThunkAction } from './index'

export type ToolbarName =
  | 'pointer'
  | 'polygon'
  | 'rectangle'
  | 'upload'
  | 'thumbnail'
  | 'previous'
  | 'next'
export type ToolbarConfig = {
  [key in ToolbarName]: {
    enable: boolean
    title: string
    icon: React.ReactNode
    href?: string
    shortcut?: string
    handler?: () => void
  }
}
export interface ToolbarState {
  busy: boolean
  current: ToolbarName
  thumbnail: boolean
}

export const initialToolbarState: ToolbarState = {
  busy: false,
  current: 'pointer',
  thumbnail: true,
}

interface ToolbarActionTypes {
  readonly SET_BUSY: 'SET_BUSY'
  readonly SET_CURRENT: 'SET_CURRENT'
  readonly SET_THUMBNAIL: 'SET_THUMBNAIL'
}

const ToolbarActionsTypes: ToolbarActionTypes = {
  SET_BUSY: 'SET_BUSY',
  SET_CURRENT: 'SET_CURRENT',
  SET_THUMBNAIL: 'SET_THUMBNAIL',
}

interface SetBusy {
  type: 'SET_BUSY'
  payload: typeof initialToolbarState.busy
}
interface SetThumbnail {
  type: 'SET_THUMBNAIL'
  payload: typeof initialToolbarState.thumbnail
}
interface SetCurrent {
  type: 'SET_CURRENT'
  payload: typeof initialToolbarState.current
}

export type ToolbarActions = SetBusy | SetCurrent | SetThumbnail

export const toolbarActions = {
  setBusy: (
    payload: typeof initialToolbarState.busy
  ): ThunkAction<ToolbarActions> => {
    return async (dispatch, getState) => {
      dispatch({
        type: ToolbarActionsTypes.SET_BUSY,
        payload,
      })
    }
  },
  setCurrent: (
    payload: typeof initialToolbarState.current
  ): ThunkAction<ToolbarActions> => {
    return async (dispatch, getState) => {
      dispatch({
        type: ToolbarActionsTypes.SET_CURRENT,
        payload,
      })
    }
  },
  toggleThumbnail: (): ThunkAction<ToolbarActions> => {
    return async (dispatch, getState) => {
      const currentState = getState().toolbar.thumbnail
      dispatch({
        type: ToolbarActionsTypes.SET_THUMBNAIL,
        payload: !currentState,
      })
    }
  },
}
export const ToolbarReducer: Reducer<ToolbarState, ToolbarActions> = (
  state: ToolbarState | undefined,
  action: ToolbarActions
): ToolbarState => {
  if (state === undefined) {
    return initialToolbarState
  }

  switch (action.type) {
    case ToolbarActionsTypes.SET_BUSY:
      return {
        ...state,
        busy: action.payload,
      }
    case ToolbarActionsTypes.SET_CURRENT:
      return {
        ...state,
        current: action.payload,
      }
    case ToolbarActionsTypes.SET_THUMBNAIL:
      return {
        ...state,
        thumbnail: action.payload,
      }
    default:
      return state
  }
}
