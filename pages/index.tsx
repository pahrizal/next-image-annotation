import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import React from 'react'
import { useDispatch } from 'react-redux'
import { toolbarActions } from '../store/toolbarState'
const AnnotationCanvas = dynamic(
  () => import('../components/annotations/AnnotationCanvas'),
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
  return <AnnotationCanvas images={[]} />
}

export default Home
