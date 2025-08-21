"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChapterModel = void 0;
class ChapterModel {
    constructor(props = {}) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        this.id = (_a = props.id) !== null && _a !== void 0 ? _a : "";
        this.title = (_b = props.title) !== null && _b !== void 0 ? _b : "";
        this.slug = (_c = props.slug) !== null && _c !== void 0 ? _c : "";
        this.link = (_d = props.link) !== null && _d !== void 0 ? _d : "";
        this.episodes = (_e = props.episodes) !== null && _e !== void 0 ? _e : [];
        this.thumbnail_url = (_f = props.thumbnail_url) !== null && _f !== void 0 ? _f : "";
        this.number_chapter = (_g = props.number_chapter) !== null && _g !== void 0 ? _g : "";
        this.published_at = (_h = props.published_at) !== null && _h !== void 0 ? _h : "";
        this.pagination = (_j = props.pagination) !== null && _j !== void 0 ? _j : { next: "", prev: "" };
        this.created_at = (_k = props.created_at) !== null && _k !== void 0 ? _k : "";
        this.updated_at = (_l = props.updated_at) !== null && _l !== void 0 ? _l : "";
    }
}
exports.ChapterModel = ChapterModel;
