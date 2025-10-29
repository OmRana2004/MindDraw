"use client";

import { WS_URL } from "@/config";
import { Canvas } from "./Canvas";
import { useEffect, useState } from "react";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMTM1ZDk1ZC0yMjI5LTQ3NDktOTkyMC0yMTlhNzMxNzk2M2MiLCJpYXQiOjE3NjE2NzI0MDd9.uicSyYCOfbIZ0gfiwtq-diB0amFCjc_DZgqKQMumm2c";

    const ws = new WebSocket(`${WS_URL}?token=${token}`);

    ws.onopen = () => {
      console.log("WebSocket connected");
      setSocket(ws);
      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId,
        })
      );
    };

    ws.onclose = (e) => {
      console.log("WebSocket closed:", e.reason || e.code);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => {
      ws.close();
    };
  }, [roomId]);

  if (!socket) {
    return <div>Connecting to server....</div>;
  }

  return (
    <div>
      <Canvas roomId={roomId} socket={socket} />
    </div>
  );
}
