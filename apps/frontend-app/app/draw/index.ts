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
    const ctx= canvas.getContext("2d");
    if(!ctx) return;

    socket.onmessage = (event) =>{
        const message = JSON.parse(event.data);

        if(message.type =="chat")
        {
            const parsedShape = JSON.parse(message.message);
            eXistingShapes.push(parsedShape);
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
        const shape: Shape = 
        {
            type :"rect",
            x:startX,
            y:startY,
            height,
            width

        }
        eXistingShapes.push(shape)
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
            ctx.strokeRect(startX,startY,width,height)

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
    })
}

async function getExistingShapes (roomId:string) {
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`)
    const messages = res.data.messages;
    const shapes = messages.map((x:{message:string}) =>{
        const messageData = JSON.parse(x.message)
        return messageData;

    })
    return shapes
}