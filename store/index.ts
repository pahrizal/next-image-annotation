import {
  State as AnnotationState,
  initialState as AnnotationInitialState,
  reducer as AnnotationReducer,
} from './annotationState'
import {
  initialToolbarState,
  ToolbarReducer,
  ToolbarState,
} from './toolbarState'

export interface AppState {
  toolbar: ToolbarState
  annotation: AnnotationState
}

export const initialAppState = {
  toolbar: initialToolbarState,
  annotation: AnnotationInitialState,
}

export const reducers = {
  toolbar: ToolbarReducer,
  annotation: AnnotationReducer,
}

export interface ThunkAction<TAction> {
  (dispatch: (action: TAction) => void, getState: () => AppState): void
}
