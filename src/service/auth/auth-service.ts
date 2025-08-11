import type { AuthRequest } from "../../dto/request/auth-request";
import { toAuthResponse, type AuthResponse } from "../../dto/response/auth-response";
import { toUserModel } from "../../helpers/mappers";
import type { IUserRepository } from "../../repository/user/iuser-repository";
import { AuthSchemaValidation } from "../../validation/auth-schema";
import { Validation } from "../../validation/validation";
import * as bcrypt from 'bcrypt'
import * as crypto from "crypto";
import type { IAuthService } from "./iauth-service";
import { ResponseError } from "../../error/response-error";
import { signAccess, signRefresh, verifyRefresh } from "../../helpers/jwt-helper";

export class AuthService implements IAuthService {
    constructor(private readonly repo: IUserRepository) {}

    async register(user: AuthRequest): Promise<AuthResponse> {
        const createRequest = Validation.validate(AuthSchemaValidation.REGISTER, user) as AuthRequest

        createRequest.password = await bcrypt.hash(createRequest.password, 10);
        const result = await this.repo.create(toUserModel(createRequest))
        return toAuthResponse(result)
    }
    
    async login(user: AuthRequest): Promise<AuthResponse> {
        const loginRequest = Validation.validate(AuthSchemaValidation.LOGIN, user) as AuthRequest
        
        const findEmail = await this.repo.findByEmail(loginRequest.email);
        if (!findEmail) throw new ResponseError(400, "email/password wrong");
        
        const ok = await bcrypt.compare(loginRequest.password, findEmail.password);
        if (!ok) throw new ResponseError(400, "email/password wrong");
        
        const accessToken = signAccess({sub: findEmail.id, email: findEmail.email, id: findEmail.id});
        const refreshToken = signRefresh({sub: findEmail.id})

        const hashed = this.hashToken(refreshToken);
        await this.repo.updateRefreshToken(findEmail.id, hashed);
        findEmail.access_token = accessToken
        findEmail.refresh_token = refreshToken

        return toAuthResponse(findEmail)
    }

    async refreshToken(refreshToken: string): Promise<AuthResponse> {
        const payload = verifyRefresh(refreshToken) as any;
        const userId  = payload.sub as string
        const user = await this.repo.findById(userId);

        if (!user) throw new ResponseError(400, "Invalid Token");
        if(!user.refresh_token) throw new ResponseError(404, "refresh_token not found");
        if (!this.compareHashed(refreshToken, user.refresh_token)) {
            await this.repo.updateRefreshToken(userId, null);
            throw new ResponseError(400, "Invalid refresh_token")
        }

        // Issue new tokens (rotation)
        const newAccess = signAccess({ sub: user.id, email: user.email });
        const newRefresh = signRefresh({ sub: user.id });
        const newHashed = this.hashToken(newRefresh);
        await this.repo.updateRefreshToken(userId, newHashed);
        user.access_token = newAccess

        // res.cookie("refresh_token", refreshToken, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === "production",
        //     sameSite: "strict",
        //     maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        // })
        user.refresh_token = refreshToken

        return toAuthResponse(user)
    }

    async logout(userId: string): Promise<void> {
        await this.repo.updateRefreshToken(userId, null);
    }

    private hashToken(token: string): string {
        // faster: use sha256; or bcrypt for extra cost
        return crypto.createHash("sha256").update(token).digest("hex");
    }
    private compareHashed(token: string, hashed: string): boolean {
        return this.hashToken(token) === hashed;
    }
}