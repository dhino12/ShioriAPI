"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthSchemaValidation = void 0;
const zod_1 = require("zod");
class AuthSchemaValidation {
}
exports.AuthSchemaValidation = AuthSchemaValidation;
AuthSchemaValidation.REGISTER = zod_1.z.object({
    name: zod_1.z.string().optional(),
    email: zod_1.z.string().min(1).max(100).email(),
    password: zod_1.z.string().min(1).max(100)
});
AuthSchemaValidation.LOGIN = zod_1.z.object({
    email: zod_1.z.string().min(1).max(100).email(),
    password: zod_1.z.string().min(1).max(100)
});
