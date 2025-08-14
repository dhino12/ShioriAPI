import type { UserModel } from "../../model/user";

export interface IUserRepository {
    create(user: UserModel): Promise<UserModel | null>
    update(user: UserModel): Promise<UserModel | null>
    updateRefreshToken(userId: string, hashed: string|null): Promise<UserModel | null>
    delete(userId: string): Promise<null>
    findById(id: string): Promise<UserModel | null>
    findByEmail(email: string): Promise<UserModel | null>
}