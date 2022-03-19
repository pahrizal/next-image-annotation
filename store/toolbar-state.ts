import { Reducer } from 'redux'
import { AppState, ThunkAction } from './index'

export interface ToolbarState {
  busy: boolean
}

export const initialToolbarState: ToolbarState = {
  busy: false,
}

interface ToolbarActionTypes {
  readonly SET_BUSY: 'SET_BUSY'
}

const ToolbarActionsTypes: ToolbarActionTypes = {
  SET_BUSY: 'SET_BUSY',
}

interface SetBusy {
  type: 'SET_BUSY'
  payload: typeof initialToolbarState.busy
}

export type ToolbarActions = SetBusy

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
    default:
      return state
  }
}
