import { useEffect, useState } from "react";

export function useSocket() {
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket>();

    useEffect(() => {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyM2I4YmM1OC1lNWIxLTQ0YTUtODEyOS1iYTEyOWQ2YTcwMmIiLCJpYXQiOjE3NjEzMTU1MjF9.oZOuQh78KM1NDoEvizNTyfyQbCG0XoNc_FQ1EMK66P4";
        const ws = new WebSocket(`ws://localhost:8080?token=${token}`);

        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        }

        ws.onclose = () => {
            console.log("WebSocket disconnected");
        }

        ws.onerror = (err) => {
            console.error("WebSocket error:", err);
        }

    }, []);

    return { socket, loading };
}
