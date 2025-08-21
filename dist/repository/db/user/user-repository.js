"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const database_1 = require("../../../app/database");
const mappers_1 = require("../../../helpers/mappers");
class UserRepository {
    update(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield database_1.prismaClient.user.update({
                where: {
                    id: user.id
                },
                data: user
            });
            return (0, mappers_1.toUserModel)(data);
        });
    }
    delete(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.prismaClient.user.delete({
                where: {
                    id: userId
                }
            });
            return null;
        });
    }
    updateRefreshToken(userId, hashed) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield database_1.prismaClient.user.update({
                where: { id: userId },
                data: {
                    refresh_token: hashed
                }
            });
            if (!data)
                return null;
            return (0, mappers_1.toUserModel)(data);
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield database_1.prismaClient.user.findFirst({
                where: { email }
            });
            if (!data)
                return null;
            return (0, mappers_1.toUserModel)(data);
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield database_1.prismaClient.user.findUnique({
                where: { id }
            });
            if (!data)
                return null;
            return (0, mappers_1.toUserModel)(data);
        });
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            user.setId();
            const data = yield database_1.prismaClient.user.create({
                data: {
                    id: user.id,
                    name: (_a = user.name) !== null && _a !== void 0 ? _a : "",
                    email: user.email,
                    password: user.password,
                    refresh_token: user.refresh_token
                }
            });
            return (0, mappers_1.toUserModel)(data);
        });
    }
}
exports.UserRepository = UserRepository;
