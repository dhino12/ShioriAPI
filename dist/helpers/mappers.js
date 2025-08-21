"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toComicModel = exports.toGenreModel = exports.toBookmarkModel = exports.toUserModel = void 0;
exports.removeNulls = removeNulls;
exports.normalizeQuery = normalizeQuery;
const bookmark_1 = require("../model/bookmark");
const comic_1 = require("../model/comic");
const genre_1 = require("../model/genre");
const user_1 = require("../model/user");
const toUserModel = (data) => {
    var _a, _b;
    return new user_1.UserModel(data.id, data.email, data.password, data.created_at, data.access_token, data.refresh_token, (_a = data.name) !== null && _a !== void 0 ? _a : "", (_b = data.updated_at) !== null && _b !== void 0 ? _b : null);
};
exports.toUserModel = toUserModel;
const toBookmarkModel = (data) => {
    var _a;
    if (data == null)
        return null;
    return new bookmark_1.BookmarkModel(data.id, data.user_id, data.comic_id, data.created_at, (_a = data.comic) !== null && _a !== void 0 ? _a : {});
};
exports.toBookmarkModel = toBookmarkModel;
const toGenreModel = (dataScraper) => {
    if (dataScraper == null)
        return null;
    const { data } = dataScraper;
    const dataGenreModel = new genre_1.GenreModel({
        id: data.id,
        title: data.title,
        slug: data.slug,
        comics: data.comics,
    });
    return dataGenreModel;
};
exports.toGenreModel = toGenreModel;
const toComicModel = (dataScraper) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    if (dataScraper == null)
        return null;
    const { data } = dataScraper;
    const dataComicModel = new comic_1.ComicModel({
        id: (_a = data.id) !== null && _a !== void 0 ? _a : "",
        type: (_b = data.type) !== null && _b !== void 0 ? _b : "",
        slug: (_c = data.slug) !== null && _c !== void 0 ? _c : "",
        title: (_d = data.title) !== null && _d !== void 0 ? _d : "",
        title_alternative: (_e = data.title_alternative) !== null && _e !== void 0 ? _e : "",
        description: (_f = data.description) !== null && _f !== void 0 ? _f : "",
        thumbnail_url: (_g = data.thumbnail_url) !== null && _g !== void 0 ? _g : "",
        status: (_h = data.status) !== null && _h !== void 0 ? _h : "",
        rating: (_j = data.rating) !== null && _j !== void 0 ? _j : "",
        author: (_k = data.author) !== null && _k !== void 0 ? _k : "",
        artist: (_l = data.artist) !== null && _l !== void 0 ? _l : "",
        views: (_m = data.views) !== null && _m !== void 0 ? _m : "",
        followedCount: (_o = data.followedCount) !== null && _o !== void 0 ? _o : "",
        genres: data.genres,
        chapters: data.chapters,
        three_new_chapters: data.chapters,
        related_comic: data.related_comic,
        created_at: (_p = data.created_at) !== null && _p !== void 0 ? _p : "",
        updated_at: (_q = data.updated_at) !== null && _q !== void 0 ? _q : "",
    });
    return dataComicModel;
};
exports.toComicModel = toComicModel;
function removeNulls(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null || v != "" || v.length != 0) // filter null & undefined
    );
}
function normalizeQuery(q, def = "") {
    if (Array.isArray(q)) {
        return q.map(v => String(v)).join(",");
    }
    if (q === undefined)
        return def;
    return String(q);
}
