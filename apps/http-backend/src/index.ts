import express from 'express';
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
     const user = await prismaClient.user.create({
        data: {
            email: parsedData.data?.username,
            password: parsedData.data.password,
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

    // compare the hashed password here
    const user = await prismaClient.user.findFirst({
        where: {
            email: parsedData.data.username,
            password: parsedData.data.password
        }
    })

    if (!user) {
        res.status(403).json({
            message: "Not authorized"
        })
        return;
    }

    const token =jwt.sign({
        userId: user?.id
    }, JWT_SECRET);

    res.json({
        token
    });
})

app.post("/room", middleware, (req, res) =>{
    const data = CreateRoomSchema.safeParse(req.body);
    if (!data.success) {
         res.json({
            message: "Incorrect inputs"
        })
        return;
    }
     // db call

     res.json({
        roomId: 123
     })

})

app.listen(3001);