import { ResponseError } from "../../error/response-error";
import { removeNulls } from "../../helpers/mappers";
import type { UserModel } from "../../model/user";

export type AuthResponse = {
    id: string
    email: string,
    created_at: Date,
    access_token?: string | null
    refresh_token?: string | null
}

export function toAuthResponse(user: UserModel | null): AuthResponse {
    if (user == null) throw new ResponseError(500, "user something error from database")
    return removeNulls({
        id: user.id,
        email: user.email,
        created_at: user.createdAt,
        access_token: user.access_token,
        refresh_token: user.refresh_token
    }) as AuthResponse
}

export function toAuthResponses(users: UserModel[]): AuthResponse[] {
    const data = users.map(user => toAuthResponse(user))
    return data
}