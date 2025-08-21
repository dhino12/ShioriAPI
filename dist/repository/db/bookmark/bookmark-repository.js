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
exports.BookmarkRepository = void 0;
const database_1 = require("../../../app/database");
const mappers_1 = require("../../../helpers/mappers");
class BookmarkRepository {
    create(bookmark) {
        return __awaiter(this, void 0, void 0, function* () {
            bookmark.setId();
            const data = yield database_1.prismaClient.bookmark.create({
                data: {
                    id: bookmark.id,
                    user_id: bookmark.user_id,
                    comic_id: bookmark.comic_id,
                },
            });
            return (0, mappers_1.toBookmarkModel)(data);
        });
    }
    delete(bookmarkId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield database_1.prismaClient.bookmark.delete({
                where: {
                    id: bookmarkId,
                },
            });
            return null;
        });
    }
    findById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield database_1.prismaClient.bookmark.findFirst({
                where: {
                    id: userId,
                },
            });
            return (0, mappers_1.toBookmarkModel)(data);
        });
    }
    findAllByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const datas = yield database_1.prismaClient.bookmark.findMany({
                where: {
                    user_id: userId,
                },
            });
            return datas
                .map((data) => (0, mappers_1.toBookmarkModel)(data))
                .filter((bookmark) => bookmark !== null);
        });
    }
}
exports.BookmarkRepository = BookmarkRepository;
