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
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="feather feather-mouse-pointer"
      {...props}
    >
      <path
        id="upload-Regular-2"
        data-name="upload-Regular"
        d="M8.47,7.531a.75.75,0,0,1,0-1.061l3-3a.749.749,0,0,1,1.06,0l3,3a.75.75,0,0,1-1.06,1.061l-1.72-1.72V11a.75.75,0,0,1-1.5,0V5.811L9.53,7.531A.751.751,0,0,1,8.47,7.531ZM17,10.25a.75.75,0,0,0,0,1.5A3.254,3.254,0,0,1,20.25,15v1A3.254,3.254,0,0,1,17,19.25H7A3.254,3.254,0,0,1,3.75,16V15A3.254,3.254,0,0,1,7,11.75a.75.75,0,0,0,0-1.5A4.756,4.756,0,0,0,2.25,15v1A4.756,4.756,0,0,0,7,20.75H17A4.756,4.756,0,0,0,21.75,16V15A4.756,4.756,0,0,0,17,10.25ZM18,15a1,1,0,1,0-1,1A1,1,0,0,0,18,15Z"
      />
    </svg>
  )
}

export default React.memo(PointerIcon)
