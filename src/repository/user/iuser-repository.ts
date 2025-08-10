import type { UserModel } from "../../model/user";

export interface IUserRepository {
    findById(id: string): Promise<UserModel | null>
    findByEmail(email: string): Promise<UserModel | null>
    create(user: UserModel): Promise<UserModel | null>
    updateRefreshToken(userId: string, hashed: string|null): Promise<UserModel | null>
}