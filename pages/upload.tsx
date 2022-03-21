import { useRouter } from 'next/router'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import uuid from 'uuid'
import ImageUploader from '../components/annotations/ImageUploader'
import { AppState } from '../store'
import { actions, ImageAnnotation } from '../store/annotationState'

const UploadPage = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const annotations = useSelector(
    (state: AppState) => state.annotation.annotations
  )
  return (
    <div>
      <ImageUploader
        targetUrl=""
        onComplete={(files) => {
          const newAnnotations: ImageAnnotation[] = files.map((f) => ({
            id: uuid(),
            imageData: f,
            annotations: [],
          }))
          dispatch(actions.setAnnotations([...annotations, ...newAnnotations]))
          router.push('/')
        }}
      />
    </div>
  )
}

export default UploadPage
