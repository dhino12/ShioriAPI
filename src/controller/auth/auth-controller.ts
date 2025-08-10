import type { Request, Response, NextFunction } from "express";
import type { AuthRequest } from "../../dto/request/auth-request";
import type { IAuthService } from "../../service/auth/iauth-service";
import type { IAuthController } from "./iauth-controller";
import { removeNulls } from "../../helpers/mappers";
import type { AuthenticatedRequest } from "../../middlewares/jwt-middleware";
import { ResponseError } from "../../error/response-error";

export class AuthController implements IAuthController {
    constructor(private readonly service: IAuthService) {}

    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const request: AuthRequest = req.body as AuthRequest
            const auth = await this.service.register(request)
            res.status(201).json({
                code: 201,
                status: "success",
                data: auth
            })
        } catch (error) {
            next(error)
        }
    }
    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const request: AuthRequest = req.body as AuthRequest
            const auth = await this.service.login(request)

            res.cookie("refresh_token", auth.refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 hari
            })
            auth.refresh_token = null

            res.status(200).json({
                code: 200,
                status: "success",
                data: removeNulls(auth)
            })
        } catch (error) {
            next(error)
        }
    }
    async logout(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        if (!req.user) throw new ResponseError(401, "unauthorized")
        try {
            await this.service.logout(req.user.id)

            res.clearCookie("refresh_token", {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
            });

            res.status(200).json({
                code: 200,
                status: "success",
                data: {}
            })
        } catch (error) {
            next(error)
        }
    }
    async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        const refreshToken = req.cookies?.refresh_token;
        
        if (!refreshToken) throw new ResponseError(401, "unauthorized")
        try {
            const resultRefreshToken = await this.service.refreshToken(refreshToken);
            // Hapus cookie refresh_token
            res.clearCookie("refresh_token");
            res.cookie("refresh_token", resultRefreshToken.refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 hari
            })
            resultRefreshToken.refresh_token = null

            res.status(200).json({
                code: 200,
                status: "success",
                data: removeNulls(resultRefreshToken)
            })
        } catch (error) {
            next(error)
        }
    }
}