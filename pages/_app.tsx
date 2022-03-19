import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AppState, initialAppState } from '../store'
import configureStore from '../store/config'
import { Provider } from 'react-redux'

const persistedState: AppState = {
  ...initialAppState,
}
const store = configureStore(persistedState)

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
