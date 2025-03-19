import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { CreatedUserSignin, CreateRoomSchema, CreateUserSignup } from "@repo/common/type";
import { prismaClient } from "@repo/db/client";
import { middleware } from "./middleware";

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const parsedData = CreateUserSignup.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Incorrect Inputs",
    });
    return;
  }
  try {
    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data?.userName,
        name: parsedData.data.name,
        password: parsedData.data.password,
      },
    });

    res.json({
      userId: user.id,
    });
  } catch (e) {
    res.status(411).json({
      message: "User already exist with this username",
    });
  }
});

app.post("/signin", async (req, res) => {
  const parsedData = CreatedUserSignin.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Incorrect Inputs",
    });
    return;
  }
  const user = await prismaClient.user.findFirst({
    where: {
      email: parsedData.data.userName,
      password: parsedData.data.password,
    },
  });

  if (!user) {
    res.status(403).json({
      message: "Unauthenicated User",
    });
    return;
  }

  
  const token = jwt.sign({ userId  : user?.id}, JWT_SECRET);

  res.json({
    token,
  });
});

app.post("/room",middleware, async (req,res) =>{
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if(!parsedData.success){
        res.json({
            message :"Incorrect Inputs"
        })
        return;
    }
    //@ts-ignore
    const userId = req.userId;
    try{
   const room = await prismaClient.room.create({
        data:{
            slug: parsedData.data.name,
            adminId:userId
        }
    })
    res.json({
        roomId: room.id
    })
}catch(e){
    res.status(411).json({
        message:"Room already exists with this namw"
    })
}

})

app.get("/chats/:roomId",async(req,res)=>{
  const roomId = Number(req.params.roomId);
  const messages = await prismaClient.chat.findMany({
    where:{
      roomId: roomId
    },
    orderBy:{
      id:"desc",
    },
    take :50
  })
  res.json({
    messages
  })
})

app.listen(3001);
