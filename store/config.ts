import thunk from 'redux-thunk'
import { AppState, reducers } from './index'
import { applyMiddleware, combineReducers, compose, createStore } from 'redux'

const bindMiddleware = (middleware: any) => {
  if (process.env.NODE_ENV !== 'production') {
    // I require this only in dev environment
    const { composeWithDevTools } = require('redux-devtools-extension')
    return composeWithDevTools(applyMiddleware(...middleware))
  }
  return applyMiddleware(...middleware)
}

export const configureStore = (initialState: AppState) => {
  const middleware = [thunk]
  const rootReducer = combineReducers({
    ...reducers,
  })
  const ENABLE_REDUX = process.env.REACT_APP_ENABLE_REDUX === 'TRUE'
  const store = createStore(
    rootReducer,
    initialState,
    bindMiddleware(middleware)
  )
  return store
}

export default configureStore
