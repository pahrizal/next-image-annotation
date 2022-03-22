import React, { SVGProps } from 'react'

const PointerIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
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
      <path d="M 9 2.59375 L 9 28.15625 L 10.65625 26.78125 L 14.6875 23.40625 L 16.71875 27.4375 L 17.15625 28.34375 L 18.0625 27.875 L 21.15625 26.28125 L 22.03125 25.84375 L 21.59375 24.9375 L 19.75 21.3125 L 24.8125 20.6875 L 26.84375 20.4375 L 25.40625 19 L 10.71875 4.28125 Z M 11 7.4375 L 22.5625 18.96875 L 18.0625 19.5 L 16.65625 19.6875 L 17.3125 20.96875 L 19.375 24.96875 L 18.0625 25.65625 L 15.90625 21.34375 L 15.3125 20.21875 L 14.34375 21.03125 L 11 23.84375 Z" />
    </svg>
  )
}

export default React.memo(PointerIcon)
