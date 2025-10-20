import axios from 'axios';
import { BACKEND_URL } from "../app/config";

async function getChats(roomId: string) {
    const res = await axios.get(`${BACKEND_URL}/chats/$(roomId)`);
    return res.data.message
}


export async function ChatRoom({id}: {
    id: string
}) {
    const message = await getChats(id);
    
}