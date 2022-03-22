import React, { SVGProps } from 'react'

const ThumbnailIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="32px"
      height="32px"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="feather feather-mouse-pointer"
      {...props}
    >
      <path d="M8,30H4a2,2,0,0,1-2-2V24a2,2,0,0,1,2-2H8a2,2,0,0,1,2,2v4A2,2,0,0,1,8,30ZM4,24v4H8V24Z" />
      <path d="M18,30H14a2,2,0,0,1-2-2V24a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v4A2,2,0,0,1,18,30Zm-4-6v4h4V24Z" />
      <path d="M28,30H24a2,2,0,0,1-2-2V24a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v4A2,2,0,0,1,28,30Zm-4-6v4h4V24Z" />
      <path d="M28,20H4a2,2,0,0,1-2-2V4A2,2,0,0,1,4,2H28a2,2,0,0,1,2,2V18A2,2,0,0,1,28,20ZM4,4V18H28V4Z" />
    </svg>
  )
}

export default React.memo(ThumbnailIcon)
