import React, { SVGProps } from 'react'

const PreviousIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
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
      <path d="M7 11.5L18 18V5z" />
      <path d="M6 18V5" />
    </svg>
  )
}

export default React.memo(PreviousIcon)
