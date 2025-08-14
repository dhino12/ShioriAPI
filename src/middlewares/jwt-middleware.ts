import type { Request, Response, NextFunction } from "express"
import { verifyAccess } from "../helpers/jwt-helper";
import { ResponseError } from "../error/response-error";

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string,
        email: string
    }
}

export function jwtAuthMiddleware(req:AuthenticatedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    console.log(authHeader, " <=======");
    
    if (!authHeader) throw new ResponseError(401, "unauthorized")

    const token = authHeader.split(" ")[1];
    try {
        if (!token || token == "") {
            throw new ResponseError(401, "unauthorized")
        }
        const payload = verifyAccess(token!) as {id: string, email: string}
        req.user = {
            id: payload.id,
            email: payload.email
        };
        
        next()
    } catch (error) {
        next(new ResponseError(401, "unauthorized"))
    }
}