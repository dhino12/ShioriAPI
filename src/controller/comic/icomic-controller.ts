import { NextFunction, Response, Request } from "express";

export interface IComicController {
    findAllLatest(req: Request, res: Response, next: NextFunction): Promise<void>
}