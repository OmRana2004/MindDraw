import express from 'express';
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/config';
import { middleware } from './middleware';
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from '@repo/common/types';
import { prismaClient } from "@repo/db/client"

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {

    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
         res.json({
            message: "Incorrect inputs"
        })
        return;
    }
   try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(parsedData.data.password, saltRounds)
     const user = await prismaClient.user.create({
        data: {
            email: parsedData.data?.username,
            password: hashedPassword,
            name: parsedData.data.name,
            photo: ""
        }
    })
    res.json({
        userId: user.id
    })
   } catch(e) {
    res.status(411).json({
        message: "User already exists with this username"
    })
   }
})

app.post("/signin",async (req, res) => {
    const parsedData = SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
         res.json({
            message: "Incorrect inputs"
        })
        return;
    }

    const user = await prismaClient.user.findFirst({
        where: {
            email: parsedData.data.username          
        }
    })

    if (!user) {
        res.status(403).json({
            message: "Not authorized"
        })
        return;
    }
    // Compare hashed password
  const isPasswordValid = await bcrypt.compare(parsedData.data.password, user.password);

  if (!isPasswordValid) {
    res.status(403).json({
      message: "Not authorized"
    });
    return;
  }

    const token =jwt.sign({
        userId: user?.id
    }, JWT_SECRET);

    res.json({
        token
    });
})

app.post("/room", middleware, async (req, res) =>{
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
         res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    const userId = req.userId;
    if (!userId) {
        res.status(403).json({
            message: "User not authenticated"
        });
        return;
    }

    try {
    const room = await prismaClient.room.create({
        data: {
            slug: parsedData.data.name,
            adminId: userId
        }
    })

     res.json({
        room: room.id
     })
    } catch(e) {
        res.status(411).json({
            message: "Room already exists with this name"
        })
    }
})

app.get("/chats/:roomId", async (req, res) => {
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
        where: {
            roomId: roomId
        },
        orderBy: {
            id: "desc"
        },
        take: 50
    });

    res.json({
        messages
    })
})

app.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where: {
            slug
        },
    });

    res.json({
        room
    })
})

app.listen(3001);