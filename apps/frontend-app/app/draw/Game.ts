import { Tool } from "../components/Canvas";
import { getExistingShapes } from "./api";

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
export class Game {
    private canvas : HTMLCanvasElement;
    private ctx:CanvasRenderingContext2D;
    private eXistingShapes: Shape[];
    private roomId : string;
    private clicked : boolean;
    private startX  =0;
    private startY  =0;
    private selectedTool : Tool = "circle";
     socket : WebSocket;


    constructor(canvas: HTMLCanvasElement, roomId: string , socket : WebSocket){
     this.canvas =canvas;
     this.ctx =canvas.getContext("2d")!;
     this.eXistingShapes = [];
     this.roomId = roomId;
     this.socket = socket;
     this.clicked = false;
     this.init();
     this.initHandlers();
     this.initMouseHandlers ();
    }

    setTool(tool :"circle" |"pencil"| "rect"){
        this.selectedTool = tool
    }
    async init(){
        this.eXistingShapes  = await getExistingShapes(this.roomId);
        this.clearCanvas();
    }
    initHandlers (){
         this.socket.onmessage = (event) =>{
        const message = JSON.parse(event.data);

        if(message.type =="chat")
        {
            const parsedShape = JSON.parse(message.message);
            this.eXistingShapes.push(parsedShape.shape);
             this.clearCanvas();
 

        }
    }

    }

    clearCanvas(){
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    this.ctx.fillStyle="rgba(0,0,0)";
    this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
    this.eXistingShapes.map((shape)=>{
        if(shape.type ==='rect'){
            this.ctx.strokeRect(shape.x,shape.y,shape.width,shape.height)
            this.ctx.strokeStyle = "rgba(255,255,255)";
        }
        else if(shape.type === "circle")
        {
          this.ctx.beginPath();
                this.ctx.arc(shape.centerX,shape.cenetrY,shape.radius,0,Math.PI*2);
                this.ctx.stroke();
                this.ctx.closePath();

        }
    })
}

initMouseHandlers (){
    this.canvas.addEventListener('mousedown',(e)=>{
        this.clicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY
    })

     this.canvas.addEventListener('mouseup',(e)=>{
        this.clicked = false;
        const width = e.clientX - this.startX;
        const height = e.clientY-this.startY;
        //@ts-ignore
        const selectedTool = this.SelectedTool;
        let shape : Shape | null = null
        if(selectedTool ==="rect")
        {
       shape = 
        {
            type : "rect",
            x: this.startX,
            y: this.startY,
            height,
            width

        }
        
       this.eXistingShapes.push(shape);
    }
    else if (selectedTool === "circle")
    {
        const radius = Math.max(width,height)/2
          shape= 
        {
            type : "circle",
            radius: radius,
            centerX: this.startX + radius,
            cenetrY: this.startY + radius,
            

        }
        
        this.eXistingShapes.push(shape);

    }
         if(!shape){
            return;
         }
         this.socket.send(JSON.stringify({
            type:"chat",
            message:JSON.stringify({shape

        } ),
         roomId : this.roomId
       
         }))


        
    })

      this.canvas.addEventListener('mousemove',(e)=>{
        if(this.clicked){
            const width = e.clientX - this.startX;
            const height = e.clientY-this.startY;
         this.clearCanvas();
            this.ctx.strokeStyle = "rgba(255,255,255)";
            //@ts-ignore
            const  selectedTool = this.SelectedTool
            if(selectedTool ==="rect")
            {
            this.ctx.strokeRect(this.startX,this.startY,width,height)
            }else if(selectedTool ==="circle"){
                const centerX = this.startX + width/2;
                const ceneterY = this.startY + height/2;
                const radius = Math.max(width,height)/2;
                this.ctx.beginPath();
               this.ctx.arc(centerX,ceneterY,radius,0,Math.PI*2);
                this.ctx.stroke();
                this.ctx.closePath();
            }

        }
    })
}
}





