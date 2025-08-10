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
        await prismaClient.user.create({
            data: {
                id: "test" + uuid().substring(0, 10),
                email: "test@gmail.com",
                name: "test",
                password: await bcrypt.hash("test", 10),
                refresh_token: "test"
            }
        })
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