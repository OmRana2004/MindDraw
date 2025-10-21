import axios from "axios"
import { BACKEND_URL } from "../../config"
import { ChatRoom } from "../../../components/ChatRoom"

async function getRoomId(slug: string) {
    const res = await axios.get(`${BACKEND_URL}/room/${slug}`)
    return res.data?.room?.id || null
}

export default async function ChatRoom1({
    params
}: {
    params: {
        slug: string
    }
}) {
    const slug = params.slug;
    const roomId = await getRoomId(slug);

    if (!roomId) return <div>Room not found</div>;

    return <ChatRoom id={roomId} />
}
