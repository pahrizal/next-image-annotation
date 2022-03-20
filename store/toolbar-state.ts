import { Reducer } from 'redux'
import pointerIcon from '../assets/icons/pointer-icon'
import polygonIcon from '../assets/icons/polygon-icon'
import rectangleIcon from '../assets/icons/rectangle-icon'
import { defaultToolbar } from '../components/toolbar'
import { AppState, ThunkAction } from './index'

export type ToolbarName = 'pointer' | 'polygon' | 'rectangle'
export type ToolbarConfig = {
  [key in ToolbarName]: {
    enable: boolean
    title: string
    icon: React.ReactNode
  }
}

export interface ToolbarState {
  busy: boolean
  current: ToolbarName
  toolbars: ToolbarConfig
}

export const initialToolbarState: ToolbarState = {
  busy: false,
  current: 'pointer',
  toolbars: defaultToolbar,
}

interface ToolbarActionTypes {
  readonly SET_BUSY: 'SET_BUSY'
  readonly SET_CURRENT: 'SET_CURRENT'
  readonly SET_TOOLBAR: 'SET_TOOLBAR'
}

const ToolbarActionsTypes: ToolbarActionTypes = {
  SET_BUSY: 'SET_BUSY',
  SET_CURRENT: 'SET_CURRENT',
  SET_TOOLBAR: 'SET_TOOLBAR',
}

interface SetBusy {
  type: 'SET_BUSY'
  payload: typeof initialToolbarState.busy
}
interface SetCurrent {
  type: 'SET_CURRENT'
  payload: typeof initialToolbarState.current
}
interface SetToolbar {
  type: 'SET_TOOLBAR'
  payload: typeof initialToolbarState.toolbars
}

export type ToolbarActions = SetBusy | SetCurrent | SetToolbar

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
  setToolbar: (
    payload: typeof initialToolbarState.toolbars
  ): ThunkAction<ToolbarActions> => {
    return async (dispatch, getState) => {
      dispatch({
        type: ToolbarActionsTypes.SET_TOOLBAR,
        payload,
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
    case ToolbarActionsTypes.SET_TOOLBAR:
      return {
        ...state,
        toolbars: action.payload,
      }
    default:
      return state
  }
}
