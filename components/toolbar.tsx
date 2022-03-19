import clsx from 'clsx'
import { useSelector } from 'react-redux'
import { AppState } from '../store'

const Toolbar = () => {
  const busy = useSelector((state: AppState) => state.toolbar.busy)
  return (
    <div
      className={clsx('fixed top-0 left-0 w-[80px] bg-white p-10', {
        'h-screen': true,
        'bg-yellow-600': busy,
      })}
    >
      a
    </div>
  )
}

export default Toolbar
