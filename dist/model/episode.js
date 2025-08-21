"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EpisodeModel = void 0;
class EpisodeModel {
    constructor(props = {}) {
        var _a, _b, _c, _d, _e, _f;
        this.id = (_a = props.id) !== null && _a !== void 0 ? _a : "";
        this.title = (_b = props.title) !== null && _b !== void 0 ? _b : "";
        this.slug = (_c = props.slug) !== null && _c !== void 0 ? _c : "";
        this.link = (_d = props.link) !== null && _d !== void 0 ? _d : "";
        this.page_number = (_e = props.page_number) !== null && _e !== void 0 ? _e : [];
        this.image_url = (_f = props.image_url) !== null && _f !== void 0 ? _f : "";
    }
}
exports.EpisodeModel = EpisodeModel;
