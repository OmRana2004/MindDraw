"use client"

import { WS_URL } from "@/config";
import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({roomId}: {roomId: string}) {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket (`${WS_URL}?token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMTM1ZDk1ZC0yMjI5LTQ3NDktOTkyMC0yMTlhNzMxNzk2M2MiLCJpYXQiOjE3NjE2NzI0MDd9.uicSyYCOfbIZ0gfiwtq-diB0amFCjc_DZgqKQMumm2c"`)

        ws.onopen = () => {
            setSocket(ws);
            ws.send(JSON.stringify({
                type: "join_room",
                roomId
            }));
        }

    }, [])
    

        if (!socket) {
            return <div>
                Connecting to server....
            </div>
        }

        return <div>
            <Canvas roomId={roomId} socket={socket} />
        </div>
}
