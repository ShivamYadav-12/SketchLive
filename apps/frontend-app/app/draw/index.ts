import { HTTP_BACKEND } from "@/config";
import axios from "axios";

type Shape ={
    type :"rect";
    x:number;
    y:number;
    width:number;
    height:number;
} |{
    type :"circle";
    radius:number;
    centerX:number;
    cenetrY:number;
}

export async  function initDraw(canvas: HTMLCanvasElement,roomId: string,socket: WebSocket){
    
    let eXistingShapes :Shape[] =await getExistingShapes(roomId);
    console.log(eXistingShapes)
    
    const ctx= canvas.getContext("2d");
    if(!ctx) return;

    socket.onmessage = (event) =>{
        const message = JSON.parse(event.data);

        if(message.type =="chat")
        {
            const parsedShape = JSON.parse(message.message);
            eXistingShapes.push(parsedShape.shape);
             clearCanvas(eXistingShapes,canvas,ctx);
 

        }
    }

   clearCanvas(eXistingShapes,canvas,ctx);
    let clicked = false;
    let startX =0;
    let startY =0;
 


    canvas.addEventListener('mousedown',(e)=>{
        clicked = true;
        startX = e.clientX;
        startY = e.clientY
    })
    canvas.addEventListener('mouseup',(e)=>{
        clicked = false;
        const width = e.clientX - startX;
        const height = e.clientY-startY;
        //@ts-ignore
        const selectedTool = window.selectedTool;
        let shape : Shape | null = null
        if(selectedTool ==="rect")
        {
       shape = 
        {
            type : "rect",
            x: startX,
            y: startY,
            height,
            width

        }
        
        eXistingShapes.push(shape);
    }
    else if (selectedTool === "circle")
    {
        const radius = Math.max(width,height)/2
          shape= 
        {
            type : "circle",
            radius: radius,
            centerX: startX + radius,
            cenetrY: startY + radius,
            

        }
        
        eXistingShapes.push(shape);

    }
         if(!shape){
            return;
         }
         socket.send(JSON.stringify({
            type:"chat",
            message:JSON.stringify({shape

        } ),
         roomId
       
         }))


        
    })
    canvas.addEventListener('mousemove',(e)=>{
        if(clicked){
            const width = e.clientX - startX;
            const height = e.clientY-startY;
         clearCanvas(eXistingShapes,canvas,ctx);
            ctx.strokeStyle = "rgba(255,255,255)";
            //@ts-ignore
            const  selectedTool = window.selectedTool
            if(selectedTool ==="rect")
            {
            ctx.strokeRect(startX,startY,width,height)
            }else if(selectedTool ==="circle"){
                const centerX = startX + width/2;
                const ceneterY = startY + height/2;
                const radius = Math.max(width,height)/2;
                ctx.beginPath();
                ctx.arc(centerX,ceneterY,radius,0,Math.PI*2);
                ctx.stroke();
                ctx.closePath();
            }

        }
    })
}

function clearCanvas(eXistingShapes:Shape[],canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="rgba(0,0,0)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    eXistingShapes.map((shape)=>{
        if(shape.type ==='rect'){
            ctx.strokeRect(shape.x,shape.y,shape.width,shape.height)
            ctx.strokeStyle = "rgba(255,255,255)";
        }
        else if(shape.type === "circle")
        {
          ctx.beginPath();
                ctx.arc(shape.centerX,shape.cenetrY,shape.radius,0,Math.PI*2);
                ctx.stroke();
                ctx.closePath();

        }
    })
}

async function getExistingShapes (roomId:string) {
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`)
    const messages = res.data.messages;
    const shapes = messages.map((x:{message:string}) =>{
        const messageData = JSON.parse(x.message)
        return messageData.shape;

    })
    return shapes
}


