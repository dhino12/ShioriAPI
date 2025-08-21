import { httpClient } from "../../../app/http-client";
import { parseHTML, parseHTMLCheerIO } from "../../../app/scraper";
import { ResponseError } from "../../../error/response-error";
import { toComicModel, toGenreModel } from "../../../helpers/mappers";
import { capitalize } from "../../../helpers/text-formatting";
import { ChapterModel, ChapterProperties, ChapterSimple } from "../../../model/chapters";
import { ComicModel, ComicProperties } from "../../../model/comic";
import { EpisodeModel, EpisodeProperties } from "../../../model/episode";
import { GenreModel, GenreProperties } from "../../../model/genre";
import { RelatedComicProperties } from "../../../model/related-comic";
import { IComicScraper } from "../icomic-scraper";
import { RootScraper } from "../root-scraper";
import pLimit from "p-limit";

interface ComicInfo {
    status?: string;
    type?: string;
    released?: string;
    author?: string;
    artist?: string;
    serialization?: string;
    postedBy?: string;
    postedOn?: string;
    updatedOn?: string;
    views?: string;
}

export class KiryuuScraper extends RootScraper implements IComicScraper {
    async getTextListComics(page: string): Promise<ComicModel[]> {
        const htmlStrng = await httpClient.get("https://kiryuu02.com/manga/list-mode")
        const $ = parseHTMLCheerIO(htmlStrng.data);
        const comics: ComicProperties[] = [];

        $(".soralist .blix").each((_, container) => {
            const groupName = $(container).find("span a").text().trim();
            $(container).find("li a").each((_, el) => {
                const $a = $(el);
                comics.push({
                    id: $a.attr("rel") ?? "",
                    title: $a.text().trim(),
                    title_alternative: `Group by ${groupName}`,
                    slug: $a.attr("href")?.split("/")[4] ?? "",
                });
            });
        });

        return comics as ComicModel[];
    }
    async getComicsByGenreSlug(slug: string, page: string): Promise<GenreModel> {
        const htmlStrng = await httpClient.get(`https://kiryuu02.com/genres/${slug}/page/${page}`)
        const document = parseHTML(await htmlStrng.data);
        const comicContainers = document.querySelectorAll(".listupd .bs")
        const limit = pLimit(10); // rate-limit 5 request per detik
        const comicsData: ComicProperties[] = await Promise.all(Array.from(comicContainers).map(container =>
                limit(async () => {
                    const title = container.querySelector(".tt")?.textContent.trim();
                    const slugComic = container.querySelector(".bsx a")?.getAttribute("href")?.split("/")[4];
                    const thumbnailURL = container.querySelector(".limit img")?.getAttribute("src");
                    const status = container.querySelector(".limit span.status")?.getAttribute("class")?.replace("status ", "").toLowerCase() ?? "ongoing";
                    const type = container.querySelector(".limit span.type")?.getAttribute("class")?.split(" ")[1] ?? "";
                    const rating = container.querySelector(".rating .numscore")?.textContent;
                    const chapter = container.querySelector(".adds .epxs")?.textContent
                    return {
                        title,
                        slug: slugComic,
                        status,
                        chapters: [{
                            slug: chapter?.toLowerCase()?.replace(" ", "-") ?? "",
                            title: chapter ?? "",
                            created_at: chapter ?? "",
                            link: `https://kiryuu02.com/${slugComic}-${chapter?.toLowerCase()?.replace(" ", "-")}/`
                        }],
                        thumbnail_url: thumbnailURL ?? "",
                        type: type ?? "",
                        rating: rating ?? "",
                    } as ComicProperties;
                })
            )
        );
        
        return toGenreModel({
            data: {
                id: "",
                slug,
                title: capitalize(slug),
                comics: comicsData
            }
        }) as GenreModel
    }
    async getGenres(): Promise<GenreModel[]> {
        const htmlStrng = await httpClient.get(`https://kiryuu02.com/manga`)
        const document = parseHTML(await htmlStrng.data);
        const genres:GenreProperties[] = []
        document.querySelectorAll("ul.genrez li").forEach(element => {
            genres.push({
                id: element.querySelector("input")?.getAttribute("value") ?? "",
                slug: element.querySelector("label")?.textContent.toLowerCase(),
                title: element.querySelector("label")?.textContent
            })
        })
        return genres as GenreModel[]
    }
    async getComicBySlug(slug: string): Promise<ComicModel> {
        const htmlStrng = await httpClient.get(`https://kiryuu02.com/manga/${slug}`);
        const document = parseHTML(await htmlStrng.data);
        const id = document.querySelector(".seriestu.seriestere article")?.getAttribute("id")?.split("-")[1];
        const title = document.querySelector(".seriestuheader h1")?.textContent;
        const alternativeTitle = document.querySelector("div.seriestualt")?.textContent.trim();
        const thumbnailURL = document.querySelector(".seriestucontent img")?.getAttribute("src");
        const followed = document.querySelector(".bmc")?.textContent;
        const rating = document.querySelector(".seriestucontent .rating-prc .num")?.textContent;
        const description = document.querySelector(".seriestucontentr [itemprop='description'] p")?.textContent.trim();
        const info: ComicInfo = {
            status: "", type: "", released: "", author: "", artist: "", serialization: "", postedBy: "",
            postedOn: "", updatedOn: "", views: "",
        };

        const genres: GenreProperties[] = [];
        const chapters: ChapterProperties[] = [];
        const reletadComic: RelatedComicProperties[] = [];
        const postViews = await httpClient.post(`https://kiryuu02.com/wp-admin/admin-ajax.php`, {
                action: "dynamic_view_ajax",
                post_id: id,
            },
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    Origin: "https://kiryuu02.com",
                    Referer: `https://kiryuu02.com/manga/` + slug, // optional
                    "X-Requested-With": "XMLHttpRequest",
                },
            }
        );
        document.querySelectorAll("table.infotable tr").forEach((tr) => {
            const tds = tr.querySelectorAll("td");
            if (tds.length >= 2) {
                const key = tds[0].textContent?.trim() || "";
                const val = tds[1].textContent?.trim();

                if (key && val) {
                    const normalizedKey = key
                        .toLowerCase()
                        .replace(/\s+(\w)/g, (_, c) => c.toUpperCase());

                    // cek apakah key itu memang ada di ComicInfo
                    if (normalizedKey in info) {
                        (info as any)[normalizedKey] = val;
                    }
                }
            }
        });
        info.views = await postViews.data.views;
        document.querySelectorAll(".seriestugenre a").forEach((element) => {
            genres.push({
                title: element?.textContent.toLowerCase(),
                slug: element?.getAttribute("href")?.split("/")[4]
            });
        });
        document.querySelectorAll("#chapterlist li").forEach((element) => {
            chapters.push({ 
                id: element.querySelector(".dt a")?.getAttribute("href")?.split("=")[1] ?? "",
                title: element.querySelector(".eph-num a .chapternum") ?.textContent ?? "",
                slug: element.querySelector(".eph-num a")?.getAttribute("href")?.split("/")[3] ?? "",
                link: element.querySelector(".eph-num a")?.getAttribute("href") ?? "",
                number_chapter: element.getAttribute("data-num") ?? "",
                published_at: element.querySelector(".eph-num .chapterdate")?.textContent ?? "",
                thumbnail_url: "",
                created_at: element.querySelector(".eph-num .chapterdate")?.textContent ?? "",
                updated_at: "",
                pagination: {
                    next: "",
                    prev: "",
                }
            });
        });
        
        document.querySelectorAll(".listupd .bs").forEach((element) => {
            const chapter = element.querySelector(".adds .epxs")?.textContent
            reletadComic.push({
                slug: element.querySelector(".bsx a")?.getAttribute("href")?.split("/")[4],
                title: element.querySelector(".tt")?.textContent.trim(),
                thumbnail_url: element.querySelector(".limit img")?.getAttribute("src") ?? "",
                rating: element.querySelector(".rating .numscore")?.textContent,
                status: element.querySelector(".limit span.status")?.getAttribute("class")?.split(" ")[1].toLowerCase() ?? "ongoing",
                type: element.querySelector(".limit span.type")?.getAttribute("class")?.split(" ")[1] ?? "",
                chapters: [{
                    id: "",
                    number_chapter: "",
                    published_at: "",
                    thumbnail_url: "",
                    updated_at: "",
                    slug: `${slug}-${chapter?.toLowerCase()?.replace(" ", "-")}`,
                    title: chapter ?? "",
                    created_at: "",
                    link: `https://kiryuu02.com/${slug}-${chapter?.toLowerCase()?.replace(" ", "-")}/`,
                    pagination: {
                        next: "",
                        prev: "",
                    }
                }],
            })
        })

        return toComicModel({
            data: {
                id,
                slug,
                title,
                title_alternative: alternativeTitle,
                chapters,
                rating,
                description: description,
                thumbnail_url: thumbnailURL ?? "",
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
        }) as ComicModel;
    }
    async getComicLatest(pages: string): Promise<ComicModel[]> {
        const htmlStrng = await httpClient.get("https://kiryuu02.com/page/" + pages);
        const document = parseHTML(await htmlStrng.data);
        const comicContainers = document.querySelectorAll(".utao");
        if (!comicContainers || comicContainers.length === 0) {
            throw new ResponseError(404, "comic latest not found");
        }
        const limit = pLimit(10); // rate-limit 5 request per detik
        const comicsDatas = (await Promise.all(
            Array.from(comicContainers).map(async (container) =>
                limit(async () => {
                    const title = container.querySelector(".bixbox h4")?.textContent?.trim() ?? "";
                    const thumbnailUrl =container.querySelector(".imgu img")?.getAttribute("src")?.trim() ?? "";
                    const type = container.querySelector(".luf ul")?.getAttribute("class");
                    const id = container.querySelector(".imgu a")?.getAttribute("rel");
                    const slug = container.querySelector(".luf a")?.getAttribute("href")?.split("/")[4] ?? "";
                    const chaptersElement = container.querySelectorAll(".luf ul li");
                    let updatedAt: string = "";
                    const chapters: ChapterSimple[] = [];
                    chaptersElement.forEach((chapterElement, index) => {
                        chapters.push({
                            title: chapterElement.querySelector("a")?.textContent ?? "",
                            slug: chapterElement.querySelector("a")?.getAttribute("href")?.split("/")[3] ?? "",
                            link: chapterElement.querySelector("a")?.getAttribute("href") ?? "",
                            created_at: chapterElement.querySelector("span")?.textContent ?? "",
                        });
                        if (index == 0) {
                            updatedAt = chapterElement.querySelector("span")?.textContent ?? "";
                        }
                    });
                    // const scrapeFromMyanimelistSearch = await this.scrapeFromMyanimelistSearch(title)

                    return {
                        id: id ?? "",
                        slug,
                        title,
                        thumbnail_url: thumbnailUrl,
                        updated_at: updatedAt,
                        type: type ?? "",
                        chapters,
                        status: "ongoing",
                        // genres: scrapeFromMyanimelistSearch?.data?.genres ?? [],
                    } as ComicProperties;
                })
            )
        ));

        return comicsDatas as ComicModel[];
    }

    async getComics(page: string, genresId: string[], status: string, type: string, order: string): Promise<ComicModel[]> {
        const genreUrlEncode = genresId.map(genreId => `genre[]=${genreId}`).join("&") // genre[]=123&genre[]=455
        const htmlStrng = await httpClient.get(`https://kiryuu02.com/manga?${genreUrlEncode}&status=${status}&type=${type}&order=${order}&page=${page}`)
        const document = parseHTML(await htmlStrng.data);
        const comicContainers = document.querySelectorAll(".listupd .bs")
        const limit = pLimit(10); // rate-limit 5 request per detik
        const comicsData: ComicProperties[] = await Promise.all(Array.from(comicContainers).map(container =>
                limit(async () => {
                    const title = container.querySelector(".tt")?.textContent.trim();
                    const slugComic = container.querySelector(".bsx a")?.getAttribute("href")?.split("/")[4];
                    const thumbnailURL = container.querySelector(".limit img")?.getAttribute("src");
                    let statusComic = container.querySelector(".limit span.status")?.getAttribute("class")?.split(" ")[1].toLowerCase() ?? "ongoing";
                    const typeComic = container.querySelector(".limit span.type")?.getAttribute("class")?.split(" ")[1] ?? "";
                    const rating = container.querySelector(".rating .numscore")?.textContent;
                    const chapter = container.querySelector(".adds .epxs")?.textContent
                    
                    const genres: GenreProperties[] = genresId.map(genreId => {
                        return {
                            id: genreId,
                            title: document.querySelector(`.genrez label[for="genre-${parseInt(genreId)}"]`)?.textContent,
                            slug: document.querySelector(`.genrez label[for="genre-${parseInt(genreId)}"]`)?.textContent.replace(" ", "-").toLowerCase()
                        }
                    })
                    
                    return {
                        title,
                        slug: slugComic,
                        status: statusComic,
                        chapters: [{
                            slug: `${slugComic}-${chapter?.toLowerCase()?.replace(" ", "-")}`,
                            title: chapter ?? "",
                            created_at: chapter ?? "",
                            link: `https://kiryuu02.com/${slugComic}-${chapter?.toLowerCase()?.replace(" ", "-")}/`
                        }],
                        genres,
                        thumbnail_url: thumbnailURL ?? "",
                        type: typeComic ?? "",
                        rating: rating ?? "",
                    } as ComicProperties;
                })
            )
        );
        return comicsData as ComicModel[]
    }

    async getChaptersByComicSlug(slug: string): Promise<ChapterModel[]> {
        const htmlStrng = await httpClient.get(`https://kiryuu02.com/manga/${slug}`);
        const document = parseHTML(await htmlStrng.data);
        const chapters: ChapterProperties[] = [];
        document.querySelectorAll("#chapterlist li").forEach((element) => {
            chapters.push({
                id: element.querySelector(".dt a")?.getAttribute("href")?.split("=")[1] ?? "",
                title: element.querySelector(".eph-num a .chapternum") ?.textContent ?? "",
                slug: element.querySelector(".eph-num a")?.getAttribute("href")?.split("/")[3] ?? "",
                link: element.querySelector(".eph-num a")?.getAttribute("href") ?? "",
                number_chapter: element.getAttribute("data-num") ?? "",
                published_at: element.querySelector(".eph-num .chapterdate")?.textContent ?? "",
                thumbnail_url: "",
                created_at: element.querySelector(".eph-num .chapterdate")?.textContent ?? "",
                updated_at: "",
                pagination: {
                    next: "",
                    prev: "",
                }
            });
        });
        return chapters as ChapterModel[]
    }

    async getChapterBySlug(slug: string): Promise<ChapterModel> {
        const htmlStrng = await httpClient.get(`https://kiryuu02.com/${slug}`);
        const document = parseHTML(await htmlStrng.data);
        const episodes: EpisodeProperties[] = [];
        const id = document.querySelector(`option[value="https://kiryuu02.com/${slug}"]`)?.getAttribute("data-id")
        const title = document.querySelector("h1.entry-title")?.textContent
        const link = document.querySelector("span.itemListElement a")?.getAttribute("href")
        const match = slug.match(/chapter-([\d.-]+)/)
        const numberChapter = match ? match[1] : null
        const publishedAt = document.querySelector("time.entry-date")?.textContent

        document.querySelectorAll("div#readerarea img").forEach((element) => {
            episodes.push({
                id: element.getAttribute("src")?.split("/")[8].replace(/\.[^/.]+$/, "") ?? "",
                title: capitalize(element.getAttribute("src")?.split("/")[6].replace(/-/g, " ") ?? ""),
                slug: element.getAttribute("src")?.replace("https://v2.yuucdn.net/uploads/manga-images/h/", "") ?? "",
                link: element?.getAttribute("src") ?? "",
                page_number: element.getAttribute("src")?.split("/")[8].replace(/\.[^/.]+$/, "") ?? "",
                image_url: element.getAttribute("src") ?? "",
            });
        });
        
        return {
            id, link, title, slug, episodes,
            number_chapter: numberChapter, 
            published_at: publishedAt, 
            created_at: publishedAt,
            pagination: {
                next: document.querySelector(".ch-prev-btn")?.getAttribute("href")?.split("/")[3],
                prev: document.querySelector(".ch-next-btn")?.getAttribute("href")?.split("/")[3],
            }
        } as ChapterModel
    }
    
    async getEpisodesByChapterSlug(slug: string): Promise<EpisodeModel[]> {
        const htmlStrng = await httpClient.get(`https://kiryuu02.com/${slug}`);
        const document = parseHTML(await htmlStrng.data);
        const episodes: EpisodeProperties[] = [];

        document.querySelectorAll("div#readerarea img").forEach((element) => {
            episodes.push({
                id: element.getAttribute("src")?.split("/")[8].replace(/\.[^/.]+$/, "") ?? "",
                title: capitalize(element.getAttribute("src")?.split("/")[6].replace(/-/g, " ") ?? ""), // remove -
                slug: element.getAttribute("src")?.replace("https://v2.yuucdn.net/uploads/manga-images/h/", "") ?? "",
                link: element?.getAttribute("src") ?? "",
                page_number: element.getAttribute("src")?.split("/")[8].replace(/\.[^/.]+$/, "") ?? "", // remove .png
                image_url: element.getAttribute("src") ?? "",
            });
        });
        
        return episodes as EpisodeModel[]
    }
}
