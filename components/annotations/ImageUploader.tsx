import clsx from 'clsx'
import React, { useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import UploadIcon from '../../assets/icons/upload-icon'
import { uploadMultipart } from '../../utils/helper'
import ImagePreview from '../ImagePreview'

type Props = {
  targetUrl?: string
  onComplete?: (files: string[]) => void
}
const ImageUploader: React.FC<Props> = ({ targetUrl = '/', onComplete }) => {
  const [uploading, setUploading] = React.useState(false)
  const [uploadedFiles, setUploadedFiles] = React.useState<string[]>([])
  const container = useRef<HTMLDivElement>(null)
  const [files, setFiles] = React.useState<File[]>([])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/jpeg',
    onDrop: (acceptedFiles) => {
      const newFiles = [...files, ...acceptedFiles]
      setFiles(newFiles)
    },
  })
  const handleUpload = async () => {
    setUploading(true)
    if (targetUrl) {
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
        await uploadMultipart(targetUrl, formData)
        setUploadedFiles([...uploadedFiles, file.name])
      }
    }
    setUploading(false)
    onComplete && onComplete(files.map((file) => URL.createObjectURL(file)))
    setFiles([])
  }
  return (
    <>
      <div
        {...getRootProps({
          className:
            'dropzone flex h-screen w-screen flex-col items-center justify-center text-lime-600',
        })}
      >
        {files.length === 0 && (
          <>
            <UploadIcon
              width={128}
              height={128}
              onClick={handleUpload}
              className="hover:drop-shadow-white  cursor-pointer hover:animate-rubber hover:drop-shadow-md"
            />
            <p className="">Drop your images here or click to upload</p>
          </>
        )}
        {files.length > 0 && (
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
        )}
      </div>
      {files.length > 0 && (
        <button
          title="Upload"
          disabled={uploading}
          onClick={handleUpload}
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
      )}
    </>
  )
}

export default ImageUploader
