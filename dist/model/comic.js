"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComicModel = void 0;
class ComicModel {
    constructor(props = {}) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        this.id = (_a = props.id) !== null && _a !== void 0 ? _a : "";
        this.type = (_b = props.type) !== null && _b !== void 0 ? _b : "";
        this.title = (_c = props.title) !== null && _c !== void 0 ? _c : "";
        this.title_alternative = (_d = props.title_alternative) !== null && _d !== void 0 ? _d : "";
        this.slug = (_e = props.slug) !== null && _e !== void 0 ? _e : "";
        this.description = (_f = props.description) !== null && _f !== void 0 ? _f : "";
        this.thumbnail_url = (_g = props.thumbnail_url) !== null && _g !== void 0 ? _g : "";
        this.status = (_h = props.status) !== null && _h !== void 0 ? _h : "";
        this.genres = props.genres;
        this.chapters = props.chapters;
        this.rating = (_j = props.rating) !== null && _j !== void 0 ? _j : "";
        this.author = (_k = props.author) !== null && _k !== void 0 ? _k : "";
        this.artist = (_l = props.artist) !== null && _l !== void 0 ? _l : "";
        this.views = (_m = props.views) !== null && _m !== void 0 ? _m : "";
        this.followedCount = (_o = props.followedCount) !== null && _o !== void 0 ? _o : "";
        this.related_comic = (_p = props.related_comic) !== null && _p !== void 0 ? _p : "";
        this.created_at = (_q = props.created_at) !== null && _q !== void 0 ? _q : "";
        this.updated_at = (_r = props.updated_at) !== null && _r !== void 0 ? _r : "";
    }
}
exports.ComicModel = ComicModel;
