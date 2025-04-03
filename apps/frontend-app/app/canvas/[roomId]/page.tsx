"use client"
import { initDraw } from "@/app/draw";
import { useEffect, useRef } from "react"


 const Canvas = () =>{
    const canvasRef = useRef<HTMLCanvasElement>(null);
  
    useEffect(()=>{
        
        if(canvasRef.current) {
        
          initDraw(canvasRef.current);


        }
        
    },[canvasRef])

    return(
        <canvas  ref={canvasRef} height={500} width={500}></canvas>
    )
}
export default Canvas;