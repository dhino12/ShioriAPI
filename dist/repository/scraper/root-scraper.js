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
exports.RootScraper = void 0;
const http_client_1 = require("../../app/http-client");
const scraper_1 = require("../../app/scraper");
const scrape_helper_1 = require("../../helpers/scrape-helper");
class RootScraper {
    getTextListComics(page) {
        throw new Error("Method not implemented.");
    }
    getEpisodesByChapterSlug(slug) {
        throw new Error("Method not implemented.");
    }
    getChapterBySlug(slug) {
        throw new Error("Method not implemented.");
    }
    getChaptersByComicSlug(slug) {
        throw new Error("Method not implemented.");
    }
    getComics(pages, genreId, status, type, order) {
        throw new Error("Method not implemented.");
    }
    getComicsByGenreSlug(slug, page) {
        throw new Error("Method not implemented.");
    }
    getGenres() {
        throw new Error("Method not implemented.");
    }
    getComicLatest(pages) {
        throw new Error("Method not implemented.");
    }
    getComicBySlug(slug) {
        throw new Error("Method not implemented.");
    }
    scrapeMangaSearchHover(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchUrl = `https://myanimelist.net/manga/${encodeURIComponent(id)}/hover`;
            const response = yield http_client_1.httpClient.get(searchUrl);
            const document = (0, scraper_1.parseHTML)(response.data);
            return {
                genres: (0, scrape_helper_1.getTextAfterLabel)(document, "Genres:"),
                status: (0, scrape_helper_1.getTextAfterLabel)(document, "Status:"),
                score: (0, scrape_helper_1.getTextAfterLabel)(document, "Score:"),
                ranked: (0, scrape_helper_1.getTextAfterLabel)(document, "Ranked:"),
            };
        });
    }
    scrapeFromMyanimelistSearch(title) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const searchUrl = `https://myanimelist.net/manga.php?q=${encodeURIComponent(title)}`;
                const documentHTML = yield http_client_1.httpClient.get(searchUrl);
                const dataHTML = yield documentHTML.data;
                if (!dataHTML)
                    return;
                const searchDocument = (0, scraper_1.parseHTML)(dataHTML);
                const sareaElement = searchDocument.querySelector('[id^="sarea"]');
                const malId = (_a = sareaElement === null || sareaElement === void 0 ? void 0 : sareaElement.id.replace(/\D/g, "")) !== null && _a !== void 0 ? _a : null;
                if (malId == null)
                    return { status: "myanimelist-id not found" };
                const resultSearchAttribute = yield this.scrapeMangaSearchHover(malId);
                return {
                    status: "success",
                    data: {
                        genres: (_b = resultSearchAttribute.genres) === null || _b === void 0 ? void 0 : _b.split(","),
                        status: resultSearchAttribute.status,
                        score: resultSearchAttribute.score,
                        ranked: resultSearchAttribute.ranked,
                    },
                };
            }
            catch (error) {
                return {
                    status: "attribute in myanimelist not found",
                    data: {
                        genres: [],
                        status: "",
                        score: "",
                        ranked: "",
                    },
                };
            }
        });
    }
}
exports.RootScraper = RootScraper;
