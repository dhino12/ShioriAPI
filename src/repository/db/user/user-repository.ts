import { prismaClient } from "../../../app/database";
import { toUserModel } from "../../../helpers/mappers";
import { UserModel } from "../../../model/user";
import type { IUserRepository } from "./iuser-repository";

export class UserRepository implements IUserRepository {
    async update(user: UserModel): Promise<UserModel | null> {
        const data = await prismaClient.user.update({
            where: {
                id: user.id
            },
            data: user
        })
        return toUserModel(data);
    }
    async delete(userId: string): Promise<null> {
        await prismaClient.user.delete({
            where: {
                id: userId
            }
        })
        return null
    }
    async updateRefreshToken(userId: string, hashed: string|null): Promise<UserModel | null> {
        const data = await prismaClient.user.update({
            where: {id: userId},
            data: {
                refresh_token: hashed
            }
        })
        if (!data) return null
        return toUserModel(data)
    }
    async findByEmail(email: string): Promise<UserModel | null> {
        const data = await prismaClient.user.findFirst({
            where: { email }
        });
        if (!data) return null;
        return toUserModel(data);
    }
    async findById(id: string): Promise<UserModel | null> {
        const data = await prismaClient.user.findUnique({
            where: { id }
        })
        if (!data) return null;
        return toUserModel(data)
    }
    async create(user: UserModel): Promise<UserModel | null> {
        user.setId();
        const data = await prismaClient.user.create({
            data: {
                id: user.id,
                name: user.name ?? "",
                email: user.email,
                password: user.password,
                refresh_token: user.refresh_token
            }
        })
        
        return toUserModel(data)
    }
}