import { JWT_SECRET } from "@repo/backend-common/config";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"


export function middleware(req: Request,res: Response ,next: NextFunction){
    const token = req.headers["authorization"] ?? "";

console.log("Received token:", token);
console.log("JWT_SECRET:", JWT_SECRET);
    const decoded = jwt.verify(token,JWT_SECRET);
    if(decoded){
        //@ts-ignore
        req.userId = decoded.userId;
        next();

    }else{
        res.status(403).json({
            message :"Unauthorized"
        })
    }

}