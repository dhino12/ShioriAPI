import { NextFunction, Request, Response } from "express";

export interface IBookmarkController {
    create(req: Request, res: Response, next: NextFunction): Promise<void>
    delete(req: Request, res: Response, next: NextFunction): Promise<void>
    findById(req: Request, res: Response, next: NextFunction): Promise<void>
    findAllByUserId(req: Request, res: Response, next: NextFunction): Promise<void>
}