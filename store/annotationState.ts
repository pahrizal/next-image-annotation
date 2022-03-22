import { Reducer } from 'redux'
import uuid from 'uuid'
import { preloadImage } from '../utils/helper'
import { ThunkAction } from './index'
import { ToolbarActions, toolbarActions } from './toolbarState'
interface BaseAnnotation {
  id: string
  color: string
  type: 'rectangle' | 'polygon' | 'line'
  points: number[]
}

export interface ImageAnnotation {
  id: string
  imageData: string
  annotations: BaseAnnotation[]
}

export interface State {
  busy: boolean
  annotations: ImageAnnotation[]
  currentIndex: number
  currentPoints: number[]
}
export const initialState: State = {
  busy: false,
  annotations: [],
  currentIndex: 0,
  currentPoints: [],
}

interface ActionTypes {
  readonly SET_BUSY: 'SET_BUSY'
  readonly SET_ANNOTATIONS: 'SET_ANNOTATIONS'
  readonly SET_CURRENT_INDEX: 'SET_CURRENT_INDEX'
  readonly SET_CURRENT_POINTS: 'SET_CURRENT_POINTS'
}

const actionsTypes: ActionTypes = {
  SET_BUSY: 'SET_BUSY',
  SET_CURRENT_INDEX: 'SET_CURRENT_INDEX',
  SET_ANNOTATIONS: 'SET_ANNOTATIONS',
  SET_CURRENT_POINTS: 'SET_CURRENT_POINTS',
}

interface SetBusy {
  type: 'SET_BUSY'
  payload: typeof initialState.busy
}
interface SetCurrentIndex {
  type: 'SET_CURRENT_INDEX'
  payload: typeof initialState.currentIndex
}
interface SetAnnotations {
  type: 'SET_ANNOTATIONS'
  payload: typeof initialState.annotations
}

interface SetCurrentPoints {
  type: 'SET_CURRENT_POINTS'
  payload: typeof initialState.currentPoints
}

export type Actions =
  | SetBusy
  | SetAnnotations
  | SetCurrentIndex
  | SetCurrentPoints

export const actions = {
  setBusy: (payload: typeof initialState.busy): ThunkAction<Actions> => {
    return async (dispatch, getState) => {
      dispatch({
        type: actionsTypes.SET_BUSY,
        payload,
      })
    }
  },
  setAnnotations: (
    payload: typeof initialState.annotations
  ): ThunkAction<Actions | ToolbarActions> => {
    return async (dispatch, getState) => {
      dispatch({
        type: actionsTypes.SET_BUSY,
        payload: true,
      })
      const newAnnotations = payload
        .map((p) => {
          if (!p.id) p.id = uuid()
          return p
        })
        .sort((a, b) => a.id.localeCompare(b.id))
      // preload all images
      for (let i = 0; i < newAnnotations.length; i++) {
        preloadImage(newAnnotations[i].imageData).then((loadedImage) => {})
      }

      dispatch({
        type: actionsTypes.SET_ANNOTATIONS,
        payload: newAnnotations,
      })
      dispatch({
        type: actionsTypes.SET_BUSY,
        payload: false,
      })
    }
  },
  setCurrentIndex: (
    payload: typeof initialState.currentIndex
  ): ThunkAction<Actions> => {
    return async (dispatch, getState) => {
      dispatch({
        type: actionsTypes.SET_CURRENT_INDEX,
        payload,
      })
    }
  },
  nextImage: (): ThunkAction<Actions> => {
    return async (dispatch, getState) => {
      const images = getState().annotation.annotations
      if (images.length === 0) return
      const currentIndex = getState().annotation.currentIndex
      const nextIndex =
        currentIndex < images.length - 1 ? currentIndex + 1 : images.length - 1
      dispatch({
        type: actionsTypes.SET_CURRENT_INDEX,
        payload: nextIndex,
      })
    }
  },
  previousImage: (): ThunkAction<Actions> => {
    return async (dispatch, getState) => {
      const images = getState().annotation.annotations
      const currentIndex = getState().annotation.currentIndex
      if (images.length === 0) return
      const nextIndex = currentIndex > 0 ? currentIndex - 1 : 0
      dispatch({
        type: actionsTypes.SET_CURRENT_INDEX,
        payload: nextIndex,
      })
    }
  },
  setCurrentPoints: (
    payload: typeof initialState.currentPoints
  ): ThunkAction<Actions> => {
    return async (dispatch, getState) => {
      dispatch({
        type: actionsTypes.SET_CURRENT_POINTS,
        payload,
      })
    }
  },
  addPoints: (
    payload: typeof initialState.currentPoints
  ): ThunkAction<Actions> => {
    return async (dispatch, getState) => {
      const points = getState().annotation.currentPoints
      dispatch({
        type: actionsTypes.SET_CURRENT_POINTS,
        payload: [...points, ...payload],
      })
    }
  },
  undoLastPoints: (): ThunkAction<Actions> => {
    return async (dispatch, getState) => {
      const points = getState().annotation.currentPoints
      dispatch({
        type: actionsTypes.SET_CURRENT_POINTS,
        payload: points.slice(0, -2),
      })
    }
  },
}
export const reducer: Reducer<State, Actions> = (
  state: State | undefined,
  action: Actions
): State => {
  if (state === undefined) {
    return initialState
  }

  switch (action.type) {
    case actionsTypes.SET_BUSY:
      return {
        ...state,
        busy: action.payload,
      }
    case actionsTypes.SET_ANNOTATIONS:
      return {
        ...state,
        annotations: action.payload,
      }
    case actionsTypes.SET_CURRENT_INDEX:
      return {
        ...state,
        currentIndex: action.payload,
      }
    case actionsTypes.SET_CURRENT_POINTS:
      return {
        ...state,
        currentPoints: action.payload,
      }
    default:
      return state
  }
}
