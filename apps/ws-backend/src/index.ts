import { WebSocketServer, WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/config';
import { prismaClient } from '@repo/db/client';

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === 'string' || !decoded || !decoded.userId) return null;
    return decoded.userId as string;
  } catch {
    return null;
  }
}

wss.on('connection', function connection(ws, request) {
  try {
    const url = request.url;
    if (!url) {
      ws.close();
      return;
    }

    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || '';
    const userId = checkUser(token);

    if (!userId) {
      ws.close();
      return;
    }

    users.push({ userId, rooms: [], ws });

    ws.on('message', async function message(data) {
      try {
        const parsedData =
          typeof data === 'string' ? JSON.parse(data) : JSON.parse(data.toString());

        if (parsedData.type === 'join_room') {
          const user = users.find((x) => x.ws === ws);
          if (user && parsedData.roomId) {
            user.rooms.push(parsedData.roomId);
          }
        }

        if (parsedData.type === 'leave_room') {
          const user = users.find((x) => x.ws === ws);
          if (!user) return;
          user.rooms = user.rooms.filter((x) => x !== parsedData.roomId);
        }

        if (parsedData.type === 'chat') {
          const roomId = Number(parsedData.roomId);
          const message = parsedData.message;

          if (!Number.isInteger(roomId)) {
            console.error('Invalid roomId:', parsedData.roomId);
            return;
          }

          try {
            await prismaClient.chat.create({
              data: {
                roomId,
                message,
                userId,
              },
            });
          } catch (dbErr) {
            console.error('Database save error:', dbErr);
          }

          users.forEach((user) => {
            if (user.rooms.includes(parsedData.roomId)) {
              user.ws.send(
                JSON.stringify({
                  type: 'chat',
                  message,
                  roomId,
                })
              );
            }
          });
        }
      } catch (err) {
        console.error('Message handling error:', err);
      }
    });
  } catch (err) {
    console.error('Connection error:', err);
    ws.close();
  }
});
