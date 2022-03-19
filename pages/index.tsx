import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import React from 'react'
const AnnotationCanvas = dynamic(
  () => import('../components/annotation-canvas'),
  {
    ssr: false,
  }
)

const imageURL = 'https://picsum.photos/1280/720'

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <AnnotationCanvas image={imageURL} />
    </div>
  )
}

export default Home
