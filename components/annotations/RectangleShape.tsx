import * as React from 'react';
import Konva from 'konva';
import {Rect} from 'react-konva';

type Props = {
    id: string,
    points:number[]
    fillColor?: string,
    strokeColor?: string,
    strokeWidth?: number,
}
const RectangleShape:React.FC<Props> = ({
    id,
    points,
    fillColor='#83CC1844',
    strokeColor='#83CC18',
    strokeWidth=4,
})=>{
    const ref = React.useRef<Konva.Rect>(null);
    return (
        <>
            <Rect
                ref={ref}
                fill={fillColor}
                strokeWidth={strokeWidth}
                x={points[0]}
                y={points[1]}
                width={points[2] - points[0]}
                height={points[3] - points[1]}
                stroke={strokeColor}
            />
        </>
    )
}

export default RectangleShape;