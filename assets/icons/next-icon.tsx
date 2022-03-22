import React, { SVGProps } from 'react'

const NextIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
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
      <path d="M17 11.5L6 18V5z" />
      <path d="M18 18V5" />
    </svg>
  )
}

export default React.memo(NextIcon)
