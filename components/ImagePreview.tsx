import clsx from 'clsx'
import React, { useRef } from 'react'
type Size = 'sm' | 'md' | 'xl' | 'xxl'
type ImageItemProp = {
  selected: boolean
  size?: Size
  image: string | File
  onHighlight?: (el: HTMLImageElement) => void
  onClick?: () => void
  pulse?: boolean
  bordered?: boolean
}
const sizes: { [key in Size]: number } = {
  sm: 64,
  md: 128,
  xl: 256,
  xxl: 512,
}
const ImagePreview: React.FC<ImageItemProp> = ({
  onHighlight,
  onClick,
  image = '',
  selected = false,
  size = 'md',
  pulse,
  bordered,
}) => {
  const ref = useRef<HTMLImageElement>(null)
  const imageData =
    typeof image === 'string' ? image : URL.createObjectURL(image)
  React.useEffect(() => {
    if (ref.current && selected && onHighlight) {
      onHighlight(ref.current)
    }
  }, [ref, selected])

  return (
    <img
      ref={ref}
      src={imageData}
      className={clsx('cursor-pointer border-lime-600 hover:opacity-100', {
        'opacity-20': !selected,
        'animate-pulse': pulse,
        'border-8 border-lime-600': bordered,
      })}
      onClick={onClick}
      width={sizes[size]}
      alt="img"
    />
  )
}

export default ImagePreview
