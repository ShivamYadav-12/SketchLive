"use client";

import { useEffect, useRef, useState } from "react";
import Canvas from "./Canvas";
import { WS_BACKEND } from "@/config";

const RoomCanvas = ({ roomId }: { roomId: string }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_BACKEND}`
    );

    ws.onopen = () => {
      setSocket(ws);
      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId,
        })
      );
    };
  }, []);
  if (!socket) {
    return;
    <div>connecting to server....</div>;
  }

  return <Canvas roomId={roomId} socket={socket}/>;
};
export default RoomCanvas;
