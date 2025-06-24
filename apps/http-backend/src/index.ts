// import express from "express";
// import jwt from "jsonwebtoken";
// import { JWT_SECRET } from "@repo/backend-common/config";
// import { CreatedUserSignin, CreateRoomSchema, CreateUserSignup } from "@repo/common/type";
// import { prismaClient } from "@repo/db/client";
// import { middleware } from "./middleware";
// import cors from "cors";

// const app = express();
// app.use(express.json());
// app.use(cors())

// app.post("/signup", async (req, res) => {
//   const parsedData = CreateUserSignup.safeParse(req.body);
//   if (!parsedData.success) {
//     res.json({
//       message: "Incorrect Inputs",
//     });
//     return;
//   }
//   try {
//     const user = await prismaClient.user.create({
//       data: {
//         email: parsedData.data?.userName,
//         name: parsedData.data.name,
//         password: parsedData.data.password,
//       },
//     });

//     res.json({
//       userId: user.id,
//     });
//   } catch (e) {
//     res.status(411).json({
//       message: "User already exist with this username",
//     });
//   }
// });

// app.post("/signin", async (req, res) => {
//   const parsedData = CreatedUserSignin.safeParse(req.body);
//   if (!parsedData.success) {
//     res.json({
//       message: "Incorrect Inputs",
//     });
//     return;
//   }
//   const user = await prismaClient.user.findFirst({
//     where: {
//       email: parsedData.data.userName,
//       password: parsedData.data.password,
//     },
//   });

//   if (!user) {
//     res.status(403).json({
//       message: "Unauthenicated User",
//     });
//     return;
//   }

  
//   const token = jwt.sign({ userId  : user?.id}, JWT_SECRET);

//   res.json({
//     token,
//   });
// });

// app.post("/room",middleware, async (req,res) =>{
//     const parsedData = CreateRoomSchema.safeParse(req.body);
//     if(!parsedData.success){
//         res.json({
//             message :"Incorrect Inputs"
//         })
//         return;
//     }
//     //@ts-ignore
//     const userId = req.userId;
//     try{
//    const room = await prismaClient.room.create({
//         data:{
//             slug: parsedData.data.name,
//             adminId:userId
//         }
//     })
//     res.json({
//         roomId: room.id
//     })
// }catch(e){
//     res.status(411).json({
//         message:"Room already exists with this name"
//     })
// }

// })

// app.get("/chats/:roomId",async(req,res)=>{
//   try{
//   const roomId = Number(req.params.roomId);
//   const messages = await prismaClient.chat.findMany({
//     where:{
//       roomId: roomId
//     },
//     orderBy:{
//       id:"desc",
//     },
//     take :50
//   })
//   res.json({
//     messages
//   })
// }
// catch(e){
//   res.json({
//     messages :[]
//   })
// }
// })

// app.get("/room/:slug",async(req,res)=>{
 
//   const slug = req.params.slug;
//   const room = await prismaClient.room.findUnique({
//     where:{
//       slug
//     }

//   })
//   res.json({
//     room
//   })

// })

// app.listen(3001);
import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '@repo/backend-common/config';
import { middleware } from "./middleware";
import { CreatedUserSignin, CreateRoomSchema, CreateUserSignup } from "@repo/common/type";
import { prismaClient } from "@repo/db/client";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors())

app.post("/signup", async (req, res) => {

    const parsedData = CreateUserSignup.safeParse(req.body);
    if (!parsedData.success) {
        console.log(parsedData.error);
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    try {
        const user = await prismaClient.user.create({
            data: {
                email: parsedData.data?.userName,
                // TODO: Hash the pw
                password: parsedData.data.password,
                name: parsedData.data.name
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

app.post("/signin", async (req, res) => {
    const parsedData = CreatedUserSignin.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }

    // TODO: Compare the hashed pws here
    const user = await prismaClient.user.findFirst({
        where: {
            email: parsedData.data.userName,
            password: parsedData.data.password
        }
    })

    if (!user) {
        res.status(403).json({
            message: "Not authorized"
        })
        return;
    }

    const token = jwt.sign({
        userId: user?.id
    }, JWT_SECRET);

    res.json({
        token
    })
})

app.post("/room", middleware, async (req, res) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    // @ts-ignore: TODO: Fix this
    const userId = req.userId;

    try {
        const room = await prismaClient.room.create({
            data: {
                slug: parsedData.data.name,
                adminId: userId
            }
        })

        res.json({
            roomId: room.id
        })
    } catch(e) {
        res.status(411).json({
            message: "Room already exists with this name"
        })
    }
})

app.get("/chats/:roomId", async (req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        console.log(req.params.roomId);
        const messages = await prismaClient.chat.findMany({
            where: {
                roomId: roomId
            },
            orderBy: {
                id: "desc"
            },
            take: 1000
        });

        res.json({
            messages
        })
    } catch(e) {
        console.log(e);
        res.json({
            messages: []
        })
    }
    
})

app.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where: {
            slug
        }
    });

    res.json({
        room
    })
})

app.listen(3001);