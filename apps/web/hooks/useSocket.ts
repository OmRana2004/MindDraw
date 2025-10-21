import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";

export function useSocket() {
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket>();

    useEffect(() =>{
        const ws = new WebSocket(`$WS_URL)?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyM2I4YmM1OC1lNWIxLTQ0YTUtODEyOS1iYTEyOWQ2YTcwMmIiLCJpYXQiOjE3NjA3ODkwODR9.W6MkKvWxY6MMkL-Em5nmUYDZ12LeQUnXJriHOv0wApI`);
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        }
    }, []);

    return {
        socket,
        loading
    }
}