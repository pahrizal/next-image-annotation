import React, { SVGProps } from 'react'

const ReactangleIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="24px"
      height="24px"
      viewBox="0 0 34 34"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby="rectangleIconTitle"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      color="currentColor"
      {...props}
    >
      <title id="rectangleIconTitle">{'Rectangle'}</title>
      <rect width={32} height={32} x={1} y={1} />
    </svg>
  )
}

export default React.memo(ReactangleIcon)
