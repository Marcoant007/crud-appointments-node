import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import auth from "../config/auth";

interface TokenPayload {
    iat: number;
    exp: number;
    sub: string;
}

export default function ensureAuthenticated(request:Request,response:Response,next:NextFunction) : void {

    const authHeader = request.headers.authorization; 

    if(!authHeader){
        throw new Error('JWT token is missing');
    }
    const [,token] = authHeader.split(' ') // estou separando por espaço
    try {
        const decoded = verify(token, auth.jwt.secret )

        const { sub } = decoded as TokenPayload; //to forçando o tipo da variavel

        request.user = {
            id: sub,
        };

        return next();
          
    } catch {
        throw new Error('Invalid JWT token')
    }
}