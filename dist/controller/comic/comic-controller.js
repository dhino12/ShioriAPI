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
exports.ComicController = void 0;
class ComicController {
    constructor(service) {
        this.service = service;
    }
    findTextListComics(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { domain } = req.params;
            const { pages = "1" } = req.query;
            const episodes = yield this.service.findTextListComics(domain, pages.toString());
            res.status(200).json({
                code: 200,
                status: "success",
                data: episodes,
            });
        });
    }
    findEpisodesByChapterSlug(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { domain, slugchapter } = req.params;
            const episodes = yield this.service.findEpisodesByChapterSlug(domain, slugchapter);
            res.status(200).json({
                code: 200,
                status: "success",
                data: episodes,
            });
        });
    }
    findChapterBySlug(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { domain, slugchapter } = req.params;
            const chapters = yield this.service.findChapterBySlug(domain, slugchapter);
            res.status(200).json({
                code: 200,
                status: "success",
                data: chapters,
            });
        });
    }
    findChaptersByComicSlug(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { domain, slug } = req.params;
            const chapters = yield this.service.findChapterByComicSlug(domain, slug);
            res.status(200).json({
                code: 200,
                status: "success",
                data: chapters,
            });
        });
    }
    findComics(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { domain } = req.params;
            const { order = "", status = "ongoing", pages = "1", type = "", } = req.query;
            const genreids = req.query["genreids[]"];
            const genreIds = Array.isArray(genreids) ? genreids.map(String) : genreids ? [String(genreids)] : [];
            const comics = yield this.service.findComics(domain, genreIds, `${status}`, `${type}`, `${order}`, `${pages}`);
            res.status(200).json({
                code: 200,
                status: "succes",
                data: comics
            });
        });
    }
    findBySlug(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { domain, slug } = req.params;
            const comic = yield this.service.findBySlug(domain, slug);
            res.status(200).json({
                code: 200,
                status: "success",
                data: comic,
            });
        });
    }
    findAllLatest(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { domain } = req.params;
            const { pages = 1 } = req.query;
            const comics = yield this.service.findAllLatest(domain, pages.toString());
            res.status(200).json({
                code: 200,
                status: "success",
                data: comics,
            });
        });
    }
    findComicsByGenreSlug(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { domain, slug } = req.params;
            const { pages = 1 } = req.query;
            const genre = yield this.service.findComicsByGenreSlug(domain, slug, pages.toString());
            res.status(200).json({
                code: 200,
                status: "success",
                data: genre
            });
        });
    }
    findAllGenres(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { domain } = req.params;
            const genres = yield this.service.findAllGenre(domain);
            res.status(200).json({
                code: 200,
                status: "success",
                data: genres
            });
        });
    }
}
exports.ComicController = ComicController;
