import React, { SVGProps } from 'react'

const PointerIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="feather feather-mouse-pointer"
      {...props}
    >
      <path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3zm10 10 6 6" />
    </svg>
  )
}

export default React.memo(PointerIcon)
