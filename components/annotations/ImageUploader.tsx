import clsx from 'clsx'
import React, { useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { useDispatch, useSelector } from 'react-redux'
import UploadIcon from '../../assets/icons/upload-icon'
import { AppState } from '../../store'
import { toolbarActions } from '../../store/toolbarState'
import { uploadMultipart } from '../../utils/helper'
import ImagePreview from '../ImagePreview'

type Props = {
  targetUrl?: string
  preview?: boolean
  onComplete?: (files: string[]) => void
}
const ImageUploader: React.FC<Props> = ({
  targetUrl = '/',
  onComplete,
  preview,
}) => {
  const [uploading, setUploading] = React.useState(false)
  const [uploadedFiles, setUploadedFiles] = React.useState<string[]>([])
  const container = useRef<HTMLDivElement>(null)
  const [files, setFiles] = React.useState<File[]>([])
  const dispatch = useDispatch()
  const { getRootProps, getInputProps, isDragActive, rootRef } = useDropzone({
    accept: 'image/jpeg',
    onDrop: (acceptedFiles) => {
      const newFiles = [...files, ...acceptedFiles]
      setFiles(newFiles)
      if (!preview) {
        handleUpload(newFiles)
      }
    },
  })
  const handleUpload = async (fileList: File[]) => {
    setUploading(true)
    if (targetUrl) {
      for (const file of fileList) {
        const formData = new FormData()
        formData.append('file', file)
        await uploadMultipart(targetUrl, formData)
        setUploadedFiles([...uploadedFiles, file.name])
      }
      setUploading(false)
      onComplete &&
        onComplete(fileList.map((file) => URL.createObjectURL(file)))
      setFiles([])
      dispatch(toolbarActions.setCurrent('pointer'))
    }
  }
  React.useEffect(() => {
    if (!preview && rootRef.current) {
      rootRef.current.click()
    }
  }, [rootRef.current])
  return (
    <>
      <div
        {...getRootProps({
          className:
            'dropzone flex h-screen w-screen flex-col items-center justify-center text-lime-600',
        })}
      >
        <input type="file" className="hidden" name="file" {...getInputProps} />
        {preview && files.length === 0 && (
          <>
            <UploadIcon
              width={128}
              height={128}
              className="hover:drop-shadow-white  cursor-pointer hover:animate-rubber hover:drop-shadow-md"
            />
            <p className="">Drop your images here or click to upload</p>
          </>
        )}
        {files.length > 0 && preview && (
          <div>
            <div
              ref={container}
              className="gap grid h-screen w-screen auto-cols-max grid-flow-row auto-rows-max grid-cols-5 gap-4 overflow-y-auto p-10"
            >
              {files.map((file, i) => (
                <ImagePreview
                  key={i}
                  onClick={() => {}}
                  selected
                  size="xl"
                  image={file}
                  pulse={uploading && !uploadedFiles.includes(file.name)}
                  bordered={uploadedFiles.includes(file.name)}
                />
              ))}
            </div>
            <button
              title="Upload"
              disabled={uploading}
              onClick={() => handleUpload(files)}
              className={clsx(
                'item-center absolute bottom-10 right-10 h-[64px] w-[64px] rounded-full text-lime-600',
                {
                  'hover:animate-rubber': !uploading,
                  'animate-rubber-infinite animate-ping': uploading,
                }
              )}
            >
              <UploadIcon width={64} height={64} />
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default ImageUploader
