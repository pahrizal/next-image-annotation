import React, { SVGProps } from 'react'

const CloseIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="feather feather-mouse-pointer"
      {...props}
    >
      <path d="M3,3 L21,21 M3,21 L21,3" />
    </svg>
  )
}

export default React.memo(CloseIcon)
