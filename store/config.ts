import thunk from 'redux-thunk'
import { AppState, reducers } from './index'
import { applyMiddleware, combineReducers, compose, createStore } from 'redux'

export const configureStore = (initialState: AppState) => {
  const middleware = [thunk]

  const rootReducer = combineReducers({
    ...reducers,
  })

  const ENABLE_REDUX = process.env.REACT_APP_ENABLE_REDUX === 'TRUE'
  const composeEnhancers = ENABLE_REDUX
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        trace: true,
      })
    : compose
  return createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middleware))
  )
}

export default configureStore
