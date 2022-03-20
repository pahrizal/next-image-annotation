import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import React from 'react'
import { useDispatch } from 'react-redux'
import Toolbar from '../components/toolbar'
import { toolbarActions } from '../store/toolbar-state'
const AnnotationCanvas = dynamic(
  () => import('../components/annotation-canvas'),
  {
    ssr: false,
  }
)

const imageURL = 'https://picsum.photos/1920/1080'

const Home: NextPage = () => {
  const dispatch = useDispatch()
  React.useEffect(() => {
    dispatch(toolbarActions.setBusy(true))
  }, [])
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <AnnotationCanvas image={imageURL} />
      <Toolbar />
    </div>
  )
}

export default Home
