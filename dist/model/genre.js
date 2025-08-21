"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenreModel = void 0;
class GenreModel {
    constructor(props = {}) {
        this.id = props.id;
        this.title = props.title;
        this.slug = props.slug;
        this.comics = props.comics;
    }
}
exports.GenreModel = GenreModel;
