import bcrypt from "bcrypt";
import {Response} from 'express'
import { prismaClient } from "../src/app/database";
import {v4 as uuid} from 'uuid'
import {UserModel} from '../src/model/user'
import {toUserModel} from '../src/helpers/mappers'

export class UserTest {
    static async delete() {
        await prismaClient.user.deleteMany({})
        // await prismaClient.$queryRaw`DELETE FROM users`;
    }

    static async create() {
        const bookmark = await prismaClient.user.create({
            data: {
                id: "test" + uuid().substring(0, 10),
                email: "test@gmail.com",
                name: "test",
                password: await bcrypt.hash("test", 10),
                refresh_token: "test"
            }
        })
        return bookmark
    }

    static async get(): Promise<UserModel> {
        const user = await prismaClient.user.findFirst({
            where: {
                email: "test@gmail.com",
            },
        });
        if (!user) {
            throw new Error("user is not found");
        }
        return toUserModel(user);
    }

    static getRefreshToken(setCookieHeader: string): String|null {
        const cookieArray = Array.isArray(setCookieHeader) ? setCookieHeader : (setCookieHeader ? [setCookieHeader] : []);
        const cookieStr = cookieArray.find(c => c.startsWith('refresh_token='));
        const token = cookieStr?.split(';')[0].split('=')[1];
        return token ? token : null
    }
}
export class BookmarkTest {
    static async delete() {
        await prismaClient.bookmark.deleteMany({})
        // await prismaClient.$queryRaw`DELETE FROM users`;
    }

    static async create(userId: string) {
        const data = await prismaClient.bookmark.create({
            data: {
                id: "test" + uuid().substring(0, 10),
                user_id: userId,
                comic_id: "comic_" + uuid().substring(0, 10)
            }
        })
        return data
    }

    static async get(id: string): Promise<UserModel> {
        const user = await prismaClient.bookmark.findFirst({
            where: { id },
        });
        if (!user) {
            throw new Error("user is not found");
        }
        return toUserModel(user);
    }

    static getRefreshToken(setCookieHeader: string): String|null {
        const cookieArray = Array.isArray(setCookieHeader) ? setCookieHeader : (setCookieHeader ? [setCookieHeader] : []);
        const cookieStr = cookieArray.find(c => c.startsWith('refresh_token='));
        const token = cookieStr?.split(';')[0].split('=')[1];
        return token ? token : null
    }
}