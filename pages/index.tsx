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

const imageURL =
  'https://design-milk.com/images/2014/12/BASE-Object-Desk-Accessories-7.jpg'

const Home: NextPage = () => {
  const dispatch = useDispatch()
  React.useEffect(() => {
    dispatch(toolbarActions.setBusy(true))
  }, [])
  return <AnnotationCanvas images={[imageURL]} />
}

export default Home
