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
exports.ScraperService = void 0;
const chapter_response_1 = require("../../dto/response/chapter-response");
const comic_response_1 = require("../../dto/response/comic-response");
const episode_response_1 = require("../../dto/response/episode-response");
const genre_response_1 = require("../../dto/response/genre-response");
const factory_scraper_1 = require("../../repository/scraper/factory-scraper");
class ScraperService {
    constructor(repositoryComicScraper) {
        this.repositoryComicScraper = repositoryComicScraper;
    }
    findTextListComics(domain, pages) {
        return __awaiter(this, void 0, void 0, function* () {
            const scraper = (0, factory_scraper_1.getScraper)(domain);
            const textComics = yield scraper.getTextListComics(pages);
            return (0, comic_response_1.toComicResponses)(textComics);
        });
    }
    findEpisodesByChapterSlug(domain, slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const scraper = (0, factory_scraper_1.getScraper)(domain);
            const episodes = yield scraper.getEpisodesByChapterSlug(slug);
            return (0, episode_response_1.toEpisodeResponses)(episodes);
        });
    }
    findChapterBySlug(domain, slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const scraper = (0, factory_scraper_1.getScraper)(domain);
            const chapter = yield scraper.getChapterBySlug(slug);
            return (0, chapter_response_1.toChapterResponse)(chapter);
        });
    }
    findChapterByComicSlug(domain, slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const scraper = (0, factory_scraper_1.getScraper)(domain);
            const chapters = yield scraper.getChaptersByComicSlug(slug);
            return (0, chapter_response_1.toChapterResponses)(chapters);
        });
    }
    findComics(domain, genresId, status, type, order, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const scraper = (0, factory_scraper_1.getScraper)(domain);
            const comics = yield scraper.getComics(page, genresId, status, type, order);
            return (0, comic_response_1.toComicResponses)(comics);
        });
    }
    findComicsByGenreSlug(domain, slug, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const scraper = (0, factory_scraper_1.getScraper)(domain);
            const genre = yield scraper.getComicsByGenreSlug(slug, page);
            return (0, genre_response_1.toGenreResponse)(genre);
        });
    }
    findAllGenre(domain) {
        return __awaiter(this, void 0, void 0, function* () {
            const scraper = (0, factory_scraper_1.getScraper)(domain);
            const genres = yield scraper.getGenres();
            return (0, genre_response_1.toGenreResponses)(genres);
        });
    }
    findBySlug(domain, slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const scraper = (0, factory_scraper_1.getScraper)(domain);
            const comic = yield scraper.getComicBySlug(slug);
            return (0, comic_response_1.toComicResponseDetail)(comic);
        });
    }
    findAllLatest(domain, pages) {
        return __awaiter(this, void 0, void 0, function* () {
            const scraper = (0, factory_scraper_1.getScraper)(domain);
            const comics = yield scraper.getComicLatest(pages);
            // const comics = await this.repositoryComicScraper?.getComicLatest()
            // for (const comic of comics) {
            // kalau mau save ke db
            // }
            return (0, comic_response_1.toComicResponses)(comics);
        });
    }
}
exports.ScraperService = ScraperService;
