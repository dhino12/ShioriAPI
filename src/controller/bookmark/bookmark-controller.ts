import { Request, Response, NextFunction } from "express";
import { IBookmarkController } from "./ibookmark-controller";
import { BookmarkCreateRequest } from "../../dto/request/bookmark-request";
import { IBookmarkService } from "../../service/bookmark/ibookmark-service";
import { AuthenticatedRequest } from "../../middlewares/jwt-middleware";
import { ResponseError } from "../../error/response-error";

export class BookmarkController implements IBookmarkController {
    constructor(private readonly service: IBookmarkService) {}
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const request: BookmarkCreateRequest = req.body as BookmarkCreateRequest
            const result = await this.service.create(request)
            res.status(201).json({
                code: 201,
                status: "success",
                data: result
            })
        } catch (error) {
            next(error)
        }
    }
    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id: string = req.params["id"]
            
            await this.service.delete(id)
            res.status(200).json({
                code: 200,
                status: "success",
                data: {}
            })
        } catch (error) {
            next(error)
        }
    }
    async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id: string = req.params["id"]
            const result = await this.service.findById(id)
            res.status(200).json({
                code: 200,
                status: "success",
                data: result
            })
        } catch (error) {
            next(error)
        }
    }
    async findAllByUserId(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        if (!req.user) throw new ResponseError(401, "unauthorized")
        try {
            const results = await this.service.findAllByUserId(req.user.id)
            res.status(200).json({
                code: 200,
                status: "success",
                data: results
            })
        } catch (error) {
            next(error)
        }
    }
}