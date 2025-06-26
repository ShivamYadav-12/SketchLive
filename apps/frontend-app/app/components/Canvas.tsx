import { useEffect, useRef, useState } from "react";
import IconButton from "./IconButton";
import { Circle, Pencil, RectangleHorizontalIcon } from "lucide-react";
import { Game } from "../draw/Game";

 export type Tool = "circle"| "rect" |"pencil"
const Canvas = ({roomId,socket}:{
    roomId: string,
    socket:WebSocket
}) =>{

    const canvasRef = useRef<HTMLCanvasElement>(null);
     const [game,setGame] = useState<Game>();
    const [selectedTool,setSelectedTool] = useState<Tool>("circle")

    useEffect(()=>{
       game?.setTool(selectedTool)
    },[selectedTool,game])
  
    useEffect(()=>{
        
        if(canvasRef.current) {
        const g = new Game(canvasRef.current,roomId,socket)
          setGame(g);
    return () =>{
        g.destroy();
    }

        }
        
    },[canvasRef])

return(
<div style={{
    height:"100vh",
    overflow:"hidden"
}}>
    <canvas ref ={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
    <Topbar selectedTool ={selectedTool} setSelectedTool = {setSelectedTool}/>
</div>
)
}

function Topbar ({selectedTool,setSelectedTool}:
    {
        selectedTool :Tool,
        setSelectedTool:(s:Tool)=> void
    }
){
    return(
    <div style={{
        position:"fixed",
        top:10,
    left: "50%",
    }}>
        <div className="flex gap-2">
   <IconButton icon={<Pencil/>} onClick={()=>{ setSelectedTool("pencil")}} activated={selectedTool ==="pencil"}/>
    <IconButton icon={<Circle/>} onClick={()=>{ setSelectedTool("circle")}} activated={selectedTool === "circle"}/>
     <IconButton icon={<RectangleHorizontalIcon/> } onClick={()=>{setSelectedTool("rect")}} activated={selectedTool ==="rect"}/>
     </div>

    </div>)
}
export default Canvas;