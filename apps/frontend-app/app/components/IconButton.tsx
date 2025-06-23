import { ReactNode } from "react";

const IconButton = (
    {icon,onClick,activated}:
    {
        icon : ReactNode,
        onClick :()=> void,
        activated:boolean
    }
) =>{
    return(
        <div className= {`pointer rounded-full border p-2 bg-black hover:bg-gray ${activated ? "text-red-500" :"text-white"}  `} onClick={onClick} > 
       {icon}
        </div>
    )
}
export default IconButton;