"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarkSchema = void 0;
const zod_1 = require("zod");
class BookmarkSchema {
}
exports.BookmarkSchema = BookmarkSchema;
BookmarkSchema.CREATE = zod_1.z.object({
    user_id: zod_1.z.string().min(1).max(100),
    comic_id: zod_1.z.string().min(1).max(100)
});
BookmarkSchema.UPDATE = zod_1.z.object({
    id: zod_1.z.string().min(1).max(100),
    user_id: zod_1.z.string().min(1).max(100),
    comic_id: zod_1.z.string().min(1).max(100)
});
