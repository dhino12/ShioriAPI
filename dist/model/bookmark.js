"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarkModel = void 0;
const uuid_1 = require("uuid");
class BookmarkModel {
    constructor(id, user_id, comic_id, created_at, comic) {
        this.id = id;
        this.user_id = user_id;
        this.comic_id = comic_id;
        this.created_at = created_at;
        this.comic = comic;
    }
    setId() {
        this.id = (0, uuid_1.v4)().substring(0, 10);
    }
}
exports.BookmarkModel = BookmarkModel;
