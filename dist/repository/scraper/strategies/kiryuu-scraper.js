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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KiryuuScraper = void 0;
const http_client_1 = require("../../../app/http-client");
const scraper_1 = require("../../../app/scraper");
const response_error_1 = require("../../../error/response-error");
const mappers_1 = require("../../../helpers/mappers");
const text_formatting_1 = require("../../../helpers/text-formatting");
const root_scraper_1 = require("../root-scraper");
const p_limit_1 = __importDefault(require("p-limit"));
class KiryuuScraper extends root_scraper_1.RootScraper {
    getTextListComics(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const htmlStrng = yield http_client_1.httpClient.get("https://kiryuu02.com/manga/list-mode");
            const $ = (0, scraper_1.parseHTMLCheerIO)(htmlStrng.data);
            const comics = [];
            $(".soralist .blix").each((_, container) => {
                const groupName = $(container).find("span a").text().trim();
                $(container).find("li a").each((_, el) => {
                    var _a, _b, _c;
                    const $a = $(el);
                    comics.push({
                        id: (_a = $a.attr("rel")) !== null && _a !== void 0 ? _a : "",
                        title: $a.text().trim(),
                        title_alternative: `Group by ${groupName}`,
                        slug: (_c = (_b = $a.attr("href")) === null || _b === void 0 ? void 0 : _b.split("/")[4]) !== null && _c !== void 0 ? _c : "",
                    });
                });
            });
            return comics;
        });
    }
    getComicsByGenreSlug(slug, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const htmlStrng = yield http_client_1.httpClient.get(`https://kiryuu02.com/genres/${slug}/page/${page}`);
            const document = (0, scraper_1.parseHTML)(yield htmlStrng.data);
            const comicContainers = document.querySelectorAll(".listupd .bs");
            const limit = (0, p_limit_1.default)(10); // rate-limit 5 request per detik
            const comicsData = yield Promise.all(Array.from(comicContainers).map(container => limit(() => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
                const title = (_a = container.querySelector(".tt")) === null || _a === void 0 ? void 0 : _a.textContent.trim();
                const slugComic = (_c = (_b = container.querySelector(".bsx a")) === null || _b === void 0 ? void 0 : _b.getAttribute("href")) === null || _c === void 0 ? void 0 : _c.split("/")[4];
                const thumbnailURL = (_d = container.querySelector(".limit img")) === null || _d === void 0 ? void 0 : _d.getAttribute("src");
                const status = (_g = (_f = (_e = container.querySelector(".limit span.status")) === null || _e === void 0 ? void 0 : _e.getAttribute("class")) === null || _f === void 0 ? void 0 : _f.replace("status ", "").toLowerCase()) !== null && _g !== void 0 ? _g : "ongoing";
                const type = (_k = (_j = (_h = container.querySelector(".limit span.type")) === null || _h === void 0 ? void 0 : _h.getAttribute("class")) === null || _j === void 0 ? void 0 : _j.split(" ")[1]) !== null && _k !== void 0 ? _k : "";
                const rating = (_l = container.querySelector(".rating .numscore")) === null || _l === void 0 ? void 0 : _l.textContent;
                const chapter = (_m = container.querySelector(".adds .epxs")) === null || _m === void 0 ? void 0 : _m.textContent;
                return {
                    title,
                    slug: slugComic,
                    status,
                    chapters: [{
                            slug: (_p = (_o = chapter === null || chapter === void 0 ? void 0 : chapter.toLowerCase()) === null || _o === void 0 ? void 0 : _o.replace(" ", "-")) !== null && _p !== void 0 ? _p : "",
                            title: chapter !== null && chapter !== void 0 ? chapter : "",
                            created_at: chapter !== null && chapter !== void 0 ? chapter : "",
                            link: `https://kiryuu02.com/${slugComic}-${(_q = chapter === null || chapter === void 0 ? void 0 : chapter.toLowerCase()) === null || _q === void 0 ? void 0 : _q.replace(" ", "-")}/`
                        }],
                    thumbnail_url: thumbnailURL !== null && thumbnailURL !== void 0 ? thumbnailURL : "",
                    type: type !== null && type !== void 0 ? type : "",
                    rating: rating !== null && rating !== void 0 ? rating : "",
                };
            }))));
            return (0, mappers_1.toGenreModel)({
                data: {
                    id: "",
                    slug,
                    title: (0, text_formatting_1.capitalize)(slug),
                    comics: comicsData
                }
            });
        });
    }
    getGenres() {
        return __awaiter(this, void 0, void 0, function* () {
            const htmlStrng = yield http_client_1.httpClient.get(`https://kiryuu02.com/manga`);
            const document = (0, scraper_1.parseHTML)(yield htmlStrng.data);
            const genres = [];
            document.querySelectorAll("ul.genrez li").forEach(element => {
                var _a, _b, _c, _d;
                genres.push({
                    id: (_b = (_a = element.querySelector("input")) === null || _a === void 0 ? void 0 : _a.getAttribute("value")) !== null && _b !== void 0 ? _b : "",
                    slug: (_c = element.querySelector("label")) === null || _c === void 0 ? void 0 : _c.textContent.toLowerCase(),
                    title: (_d = element.querySelector("label")) === null || _d === void 0 ? void 0 : _d.textContent
                });
            });
            return genres;
        });
    }
    getComicBySlug(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const htmlStrng = yield http_client_1.httpClient.get(`https://kiryuu02.com/manga/${slug}`);
            const document = (0, scraper_1.parseHTML)(yield htmlStrng.data);
            const id = (_b = (_a = document.querySelector(".seriestu.seriestere article")) === null || _a === void 0 ? void 0 : _a.getAttribute("id")) === null || _b === void 0 ? void 0 : _b.split("-")[1];
            const title = (_c = document.querySelector(".seriestuheader h1")) === null || _c === void 0 ? void 0 : _c.textContent;
            const alternativeTitle = (_d = document.querySelector("div.seriestualt")) === null || _d === void 0 ? void 0 : _d.textContent.trim();
            const thumbnailURL = (_e = document.querySelector(".seriestucontent img")) === null || _e === void 0 ? void 0 : _e.getAttribute("src");
            const followed = (_f = document.querySelector(".bmc")) === null || _f === void 0 ? void 0 : _f.textContent;
            const rating = (_g = document.querySelector(".seriestucontent .rating-prc .num")) === null || _g === void 0 ? void 0 : _g.textContent;
            const description = (_h = document.querySelector(".seriestucontentr [itemprop='description'] p")) === null || _h === void 0 ? void 0 : _h.textContent.trim();
            const info = {
                status: "", type: "", released: "", author: "", artist: "", serialization: "", postedBy: "",
                postedOn: "", updatedOn: "", views: "",
            };
            const genres = [];
            const chapters = [];
            const reletadComic = [];
            const postViews = yield http_client_1.httpClient.post(`https://kiryuu02.com/wp-admin/admin-ajax.php`, {
                action: "dynamic_view_ajax",
                post_id: id,
            }, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    Origin: "https://kiryuu02.com",
                    Referer: `https://kiryuu02.com/manga/` + slug, // optional
                    "X-Requested-With": "XMLHttpRequest",
                },
            });
            document.querySelectorAll("table.infotable tr").forEach((tr) => {
                var _a, _b;
                const tds = tr.querySelectorAll("td");
                if (tds.length >= 2) {
                    const key = ((_a = tds[0].textContent) === null || _a === void 0 ? void 0 : _a.trim()) || "";
                    const val = (_b = tds[1].textContent) === null || _b === void 0 ? void 0 : _b.trim();
                    if (key && val) {
                        const normalizedKey = key
                            .toLowerCase()
                            .replace(/\s+(\w)/g, (_, c) => c.toUpperCase());
                        // cek apakah key itu memang ada di ComicInfo
                        if (normalizedKey in info) {
                            info[normalizedKey] = val;
                        }
                    }
                }
            });
            info.views = yield postViews.data.views;
            document.querySelectorAll(".seriestugenre a").forEach((element) => {
                var _a;
                genres.push({
                    title: element === null || element === void 0 ? void 0 : element.textContent.toLowerCase(),
                    slug: (_a = element === null || element === void 0 ? void 0 : element.getAttribute("href")) === null || _a === void 0 ? void 0 : _a.split("/")[4]
                });
            });
            document.querySelectorAll("#chapterlist li").forEach((element) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
                chapters.push({
                    id: (_c = (_b = (_a = element.querySelector(".dt a")) === null || _a === void 0 ? void 0 : _a.getAttribute("href")) === null || _b === void 0 ? void 0 : _b.split("=")[1]) !== null && _c !== void 0 ? _c : "",
                    title: (_e = (_d = element.querySelector(".eph-num a .chapternum")) === null || _d === void 0 ? void 0 : _d.textContent) !== null && _e !== void 0 ? _e : "",
                    slug: (_h = (_g = (_f = element.querySelector(".eph-num a")) === null || _f === void 0 ? void 0 : _f.getAttribute("href")) === null || _g === void 0 ? void 0 : _g.split("/")[3]) !== null && _h !== void 0 ? _h : "",
                    link: (_k = (_j = element.querySelector(".eph-num a")) === null || _j === void 0 ? void 0 : _j.getAttribute("href")) !== null && _k !== void 0 ? _k : "",
                    number_chapter: (_l = element.getAttribute("data-num")) !== null && _l !== void 0 ? _l : "",
                    published_at: (_o = (_m = element.querySelector(".eph-num .chapterdate")) === null || _m === void 0 ? void 0 : _m.textContent) !== null && _o !== void 0 ? _o : "",
                    thumbnail_url: "",
                    created_at: (_q = (_p = element.querySelector(".eph-num .chapterdate")) === null || _p === void 0 ? void 0 : _p.textContent) !== null && _q !== void 0 ? _q : "",
                    updated_at: "",
                    pagination: {
                        next: "",
                        prev: "",
                    }
                });
            });
            document.querySelectorAll(".listupd .bs").forEach((element) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
                const chapter = (_a = element.querySelector(".adds .epxs")) === null || _a === void 0 ? void 0 : _a.textContent;
                reletadComic.push({
                    slug: (_c = (_b = element.querySelector(".bsx a")) === null || _b === void 0 ? void 0 : _b.getAttribute("href")) === null || _c === void 0 ? void 0 : _c.split("/")[4],
                    title: (_d = element.querySelector(".tt")) === null || _d === void 0 ? void 0 : _d.textContent.trim(),
                    thumbnail_url: (_f = (_e = element.querySelector(".limit img")) === null || _e === void 0 ? void 0 : _e.getAttribute("src")) !== null && _f !== void 0 ? _f : "",
                    rating: (_g = element.querySelector(".rating .numscore")) === null || _g === void 0 ? void 0 : _g.textContent,
                    status: (_k = (_j = (_h = element.querySelector(".limit span.status")) === null || _h === void 0 ? void 0 : _h.getAttribute("class")) === null || _j === void 0 ? void 0 : _j.split(" ")[1].toLowerCase()) !== null && _k !== void 0 ? _k : "ongoing",
                    type: (_o = (_m = (_l = element.querySelector(".limit span.type")) === null || _l === void 0 ? void 0 : _l.getAttribute("class")) === null || _m === void 0 ? void 0 : _m.split(" ")[1]) !== null && _o !== void 0 ? _o : "",
                    chapters: [{
                            id: "",
                            number_chapter: "",
                            published_at: "",
                            thumbnail_url: "",
                            updated_at: "",
                            slug: `${slug}-${(_p = chapter === null || chapter === void 0 ? void 0 : chapter.toLowerCase()) === null || _p === void 0 ? void 0 : _p.replace(" ", "-")}`,
                            title: chapter !== null && chapter !== void 0 ? chapter : "",
                            created_at: "",
                            link: `https://kiryuu02.com/${slug}-${(_q = chapter === null || chapter === void 0 ? void 0 : chapter.toLowerCase()) === null || _q === void 0 ? void 0 : _q.replace(" ", "-")}/`,
                            pagination: {
                                next: "",
                                prev: "",
                            }
                        }],
                });
            });
            return (0, mappers_1.toComicModel)({
                data: {
                    id,
                    slug,
                    title,
                    title_alternative: alternativeTitle,
                    chapters,
                    rating,
                    description: description,
                    thumbnail_url: thumbnailURL !== null && thumbnailURL !== void 0 ? thumbnailURL : "",
                    type: info.type,
                    genres: genres,
                    status: info.status,
                    author: info.author,
                    artist: info.artist,
                    views: info.views,
                    followedCount: followed,
                    related_comic: reletadComic,
                    created_at: info.postedOn,
                    updated_at: info.updatedOn,
                },
            });
        });
    }
    getComicLatest(pages) {
        return __awaiter(this, void 0, void 0, function* () {
            const htmlStrng = yield http_client_1.httpClient.get("https://kiryuu02.com/page/" + pages);
            const document = (0, scraper_1.parseHTML)(yield htmlStrng.data);
            const comicContainers = document.querySelectorAll(".utao");
            if (!comicContainers || comicContainers.length === 0) {
                throw new response_error_1.ResponseError(404, "comic latest not found");
            }
            const limit = (0, p_limit_1.default)(10); // rate-limit 5 request per detik
            const comicsDatas = (yield Promise.all(Array.from(comicContainers).map((container) => __awaiter(this, void 0, void 0, function* () {
                return limit(() => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                    const title = (_c = (_b = (_a = container.querySelector(".bixbox h4")) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : "";
                    const thumbnailUrl = (_f = (_e = (_d = container.querySelector(".imgu img")) === null || _d === void 0 ? void 0 : _d.getAttribute("src")) === null || _e === void 0 ? void 0 : _e.trim()) !== null && _f !== void 0 ? _f : "";
                    const type = (_g = container.querySelector(".luf ul")) === null || _g === void 0 ? void 0 : _g.getAttribute("class");
                    const id = (_h = container.querySelector(".imgu a")) === null || _h === void 0 ? void 0 : _h.getAttribute("rel");
                    const slug = (_l = (_k = (_j = container.querySelector(".luf a")) === null || _j === void 0 ? void 0 : _j.getAttribute("href")) === null || _k === void 0 ? void 0 : _k.split("/")[4]) !== null && _l !== void 0 ? _l : "";
                    const chaptersElement = container.querySelectorAll(".luf ul li");
                    let updatedAt = "";
                    const chapters = [];
                    chaptersElement.forEach((chapterElement, index) => {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                        chapters.push({
                            title: (_b = (_a = chapterElement.querySelector("a")) === null || _a === void 0 ? void 0 : _a.textContent) !== null && _b !== void 0 ? _b : "",
                            slug: (_e = (_d = (_c = chapterElement.querySelector("a")) === null || _c === void 0 ? void 0 : _c.getAttribute("href")) === null || _d === void 0 ? void 0 : _d.split("/")[3]) !== null && _e !== void 0 ? _e : "",
                            link: (_g = (_f = chapterElement.querySelector("a")) === null || _f === void 0 ? void 0 : _f.getAttribute("href")) !== null && _g !== void 0 ? _g : "",
                            created_at: (_j = (_h = chapterElement.querySelector("span")) === null || _h === void 0 ? void 0 : _h.textContent) !== null && _j !== void 0 ? _j : "",
                        });
                        if (index == 0) {
                            updatedAt = (_l = (_k = chapterElement.querySelector("span")) === null || _k === void 0 ? void 0 : _k.textContent) !== null && _l !== void 0 ? _l : "";
                        }
                    });
                    // const scrapeFromMyanimelistSearch = await this.scrapeFromMyanimelistSearch(title)
                    return {
                        id: id !== null && id !== void 0 ? id : "",
                        slug,
                        title,
                        thumbnail_url: thumbnailUrl,
                        updated_at: updatedAt,
                        type: type !== null && type !== void 0 ? type : "",
                        chapters,
                        status: "ongoing",
                        // genres: scrapeFromMyanimelistSearch?.data?.genres ?? [],
                    };
                }));
            }))));
            return comicsDatas;
        });
    }
    getComics(page, genresId, status, type, order) {
        return __awaiter(this, void 0, void 0, function* () {
            const genreUrlEncode = genresId.map(genreId => `genre[]=${genreId}`).join("&"); // genre[]=123&genre[]=455
            const htmlStrng = yield http_client_1.httpClient.get(`https://kiryuu02.com/manga?${genreUrlEncode}&status=${status}&type=${type}&order=${order}&page=${page}`);
            const document = (0, scraper_1.parseHTML)(yield htmlStrng.data);
            const comicContainers = document.querySelectorAll(".listupd .bs");
            const limit = (0, p_limit_1.default)(10); // rate-limit 5 request per detik
            const comicsData = yield Promise.all(Array.from(comicContainers).map(container => limit(() => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
                const title = (_a = container.querySelector(".tt")) === null || _a === void 0 ? void 0 : _a.textContent.trim();
                const slugComic = (_c = (_b = container.querySelector(".bsx a")) === null || _b === void 0 ? void 0 : _b.getAttribute("href")) === null || _c === void 0 ? void 0 : _c.split("/")[4];
                const thumbnailURL = (_d = container.querySelector(".limit img")) === null || _d === void 0 ? void 0 : _d.getAttribute("src");
                let statusComic = (_g = (_f = (_e = container.querySelector(".limit span.status")) === null || _e === void 0 ? void 0 : _e.getAttribute("class")) === null || _f === void 0 ? void 0 : _f.split(" ")[1].toLowerCase()) !== null && _g !== void 0 ? _g : "ongoing";
                const typeComic = (_k = (_j = (_h = container.querySelector(".limit span.type")) === null || _h === void 0 ? void 0 : _h.getAttribute("class")) === null || _j === void 0 ? void 0 : _j.split(" ")[1]) !== null && _k !== void 0 ? _k : "";
                const rating = (_l = container.querySelector(".rating .numscore")) === null || _l === void 0 ? void 0 : _l.textContent;
                const chapter = (_m = container.querySelector(".adds .epxs")) === null || _m === void 0 ? void 0 : _m.textContent;
                const genres = genresId.map(genreId => {
                    var _a, _b;
                    return {
                        id: genreId,
                        title: (_a = document.querySelector(`.genrez label[for="genre-${parseInt(genreId)}"]`)) === null || _a === void 0 ? void 0 : _a.textContent,
                        slug: (_b = document.querySelector(`.genrez label[for="genre-${parseInt(genreId)}"]`)) === null || _b === void 0 ? void 0 : _b.textContent.replace(" ", "-").toLowerCase()
                    };
                });
                return {
                    title,
                    slug: slugComic,
                    status: statusComic,
                    chapters: [{
                            slug: `${slugComic}-${(_o = chapter === null || chapter === void 0 ? void 0 : chapter.toLowerCase()) === null || _o === void 0 ? void 0 : _o.replace(" ", "-")}`,
                            title: chapter !== null && chapter !== void 0 ? chapter : "",
                            created_at: chapter !== null && chapter !== void 0 ? chapter : "",
                            link: `https://kiryuu02.com/${slugComic}-${(_p = chapter === null || chapter === void 0 ? void 0 : chapter.toLowerCase()) === null || _p === void 0 ? void 0 : _p.replace(" ", "-")}/`
                        }],
                    genres,
                    thumbnail_url: thumbnailURL !== null && thumbnailURL !== void 0 ? thumbnailURL : "",
                    type: typeComic !== null && typeComic !== void 0 ? typeComic : "",
                    rating: rating !== null && rating !== void 0 ? rating : "",
                };
            }))));
            return comicsData;
        });
    }
    getChaptersByComicSlug(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const htmlStrng = yield http_client_1.httpClient.get(`https://kiryuu02.com/manga/${slug}`);
            const document = (0, scraper_1.parseHTML)(yield htmlStrng.data);
            const chapters = [];
            document.querySelectorAll("#chapterlist li").forEach((element) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
                chapters.push({
                    id: (_c = (_b = (_a = element.querySelector(".dt a")) === null || _a === void 0 ? void 0 : _a.getAttribute("href")) === null || _b === void 0 ? void 0 : _b.split("=")[1]) !== null && _c !== void 0 ? _c : "",
                    title: (_e = (_d = element.querySelector(".eph-num a .chapternum")) === null || _d === void 0 ? void 0 : _d.textContent) !== null && _e !== void 0 ? _e : "",
                    slug: (_h = (_g = (_f = element.querySelector(".eph-num a")) === null || _f === void 0 ? void 0 : _f.getAttribute("href")) === null || _g === void 0 ? void 0 : _g.split("/")[3]) !== null && _h !== void 0 ? _h : "",
                    link: (_k = (_j = element.querySelector(".eph-num a")) === null || _j === void 0 ? void 0 : _j.getAttribute("href")) !== null && _k !== void 0 ? _k : "",
                    number_chapter: (_l = element.getAttribute("data-num")) !== null && _l !== void 0 ? _l : "",
                    published_at: (_o = (_m = element.querySelector(".eph-num .chapterdate")) === null || _m === void 0 ? void 0 : _m.textContent) !== null && _o !== void 0 ? _o : "",
                    thumbnail_url: "",
                    created_at: (_q = (_p = element.querySelector(".eph-num .chapterdate")) === null || _p === void 0 ? void 0 : _p.textContent) !== null && _q !== void 0 ? _q : "",
                    updated_at: "",
                    pagination: {
                        next: "",
                        prev: "",
                    }
                });
            });
            return chapters;
        });
    }
    getChapterBySlug(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const htmlStrng = yield http_client_1.httpClient.get(`https://kiryuu02.com/${slug}`);
            const document = (0, scraper_1.parseHTML)(yield htmlStrng.data);
            const episodes = [];
            const id = (_a = document.querySelector(`option[value="https://kiryuu02.com/${slug}"]`)) === null || _a === void 0 ? void 0 : _a.getAttribute("data-id");
            const title = (_b = document.querySelector("h1.entry-title")) === null || _b === void 0 ? void 0 : _b.textContent;
            const link = (_c = document.querySelector("span.itemListElement a")) === null || _c === void 0 ? void 0 : _c.getAttribute("href");
            const match = slug.match(/chapter-([\d.-]+)/);
            const numberChapter = match ? match[1] : null;
            const publishedAt = (_d = document.querySelector("time.entry-date")) === null || _d === void 0 ? void 0 : _d.textContent;
            document.querySelectorAll("div#readerarea img").forEach((element) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                episodes.push({
                    id: (_b = (_a = element.getAttribute("src")) === null || _a === void 0 ? void 0 : _a.split("/")[8].replace(/\.[^/.]+$/, "")) !== null && _b !== void 0 ? _b : "",
                    title: (0, text_formatting_1.capitalize)((_d = (_c = element.getAttribute("src")) === null || _c === void 0 ? void 0 : _c.split("/")[6].replace(/-/g, " ")) !== null && _d !== void 0 ? _d : ""),
                    slug: (_f = (_e = element.getAttribute("src")) === null || _e === void 0 ? void 0 : _e.replace("https://v2.yuucdn.net/uploads/manga-images/h/", "")) !== null && _f !== void 0 ? _f : "",
                    link: (_g = element === null || element === void 0 ? void 0 : element.getAttribute("src")) !== null && _g !== void 0 ? _g : "",
                    page_number: (_j = (_h = element.getAttribute("src")) === null || _h === void 0 ? void 0 : _h.split("/")[8].replace(/\.[^/.]+$/, "")) !== null && _j !== void 0 ? _j : "",
                    image_url: (_k = element.getAttribute("src")) !== null && _k !== void 0 ? _k : "",
                });
            });
            return {
                id, link, title, slug, episodes,
                number_chapter: numberChapter,
                published_at: publishedAt,
                created_at: publishedAt,
                pagination: {
                    next: (_f = (_e = document.querySelector(".ch-prev-btn")) === null || _e === void 0 ? void 0 : _e.getAttribute("href")) === null || _f === void 0 ? void 0 : _f.split("/")[3],
                    prev: (_h = (_g = document.querySelector(".ch-next-btn")) === null || _g === void 0 ? void 0 : _g.getAttribute("href")) === null || _h === void 0 ? void 0 : _h.split("/")[3],
                }
            };
        });
    }
    getEpisodesByChapterSlug(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const htmlStrng = yield http_client_1.httpClient.get(`https://kiryuu02.com/${slug}`);
            const document = (0, scraper_1.parseHTML)(yield htmlStrng.data);
            const episodes = [];
            document.querySelectorAll("div#readerarea img").forEach((element) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                episodes.push({
                    id: (_b = (_a = element.getAttribute("src")) === null || _a === void 0 ? void 0 : _a.split("/")[8].replace(/\.[^/.]+$/, "")) !== null && _b !== void 0 ? _b : "",
                    title: (0, text_formatting_1.capitalize)((_d = (_c = element.getAttribute("src")) === null || _c === void 0 ? void 0 : _c.split("/")[6].replace(/-/g, " ")) !== null && _d !== void 0 ? _d : ""), // remove -
                    slug: (_f = (_e = element.getAttribute("src")) === null || _e === void 0 ? void 0 : _e.replace("https://v2.yuucdn.net/uploads/manga-images/h/", "")) !== null && _f !== void 0 ? _f : "",
                    link: (_g = element === null || element === void 0 ? void 0 : element.getAttribute("src")) !== null && _g !== void 0 ? _g : "",
                    page_number: (_j = (_h = element.getAttribute("src")) === null || _h === void 0 ? void 0 : _h.split("/")[8].replace(/\.[^/.]+$/, "")) !== null && _j !== void 0 ? _j : "", // remove .png
                    image_url: (_k = element.getAttribute("src")) !== null && _k !== void 0 ? _k : "",
                });
            });
            return episodes;
        });
    }
}
exports.KiryuuScraper = KiryuuScraper;
