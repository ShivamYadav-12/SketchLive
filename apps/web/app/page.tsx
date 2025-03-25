"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";





export default function Home() {
  const [roomId,setRoomId] = useState("");
  const router = useRouter();
  return (
    <div style={{
      display:"flex",
      flexDirection:"column",
        gap:"4px",
      alignItems: "center",
      justifyContent:"center",
      height:"100vh",
      width:"100vw",
      background:"black"

    }} >
      <div > 
        <input style={{
          padding: "10px",
          border:"2px solid black",
          borderRadius:"15px",
          


        }} value={roomId} onChange={(e) => setRoomId(e.target.value)} type="text" placeholder="Enter your room Id" />
        </div>
        <div>
        <button  style={{
          cursor:"pointer",
          padding:"5px 15px",
          backgroundColor:"red",
          border:"2px solid black",
          borderRadius: "5px",
          color:"white"

      
        
        }}
        onClick={ () =>{
          router.push(`/room/${roomId}`)

        }
        }>Join Room</button>
      </div>
     
    </div>
  );
}
