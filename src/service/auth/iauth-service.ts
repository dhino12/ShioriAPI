import type { Response } from "express";
import type { AuthRequest } from "../../dto/request/auth-request";
import type { AuthResponse } from "../../dto/response/auth-response";

export interface IAuthService {
    register(user: AuthRequest): Promise<AuthResponse>
    login(user: AuthRequest): Promise<AuthResponse>
    logout(userId: string): Promise<void>
    refreshToken(refreshToken: string): Promise<AuthResponse>
}