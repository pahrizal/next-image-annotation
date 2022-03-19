import {
  initialToolbarState,
  ToolbarReducer,
  ToolbarState,
} from './toolbar-state'

export interface AppState {
  toolbar: ToolbarState
}

export const initialAppState = {
  toolbar: initialToolbarState,
}

export const reducers = {
  toolbar: ToolbarReducer,
}

export interface ThunkAction<TAction> {
  (dispatch: (action: TAction) => void, getState: () => AppState): void
}
