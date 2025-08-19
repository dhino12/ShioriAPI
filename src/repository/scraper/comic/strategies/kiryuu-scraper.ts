import { httpClient } from "../../../../app/http-client";
import { parseHTML } from "../../../../app/scraper";
import { ResponseError } from "../../../../error/response-error";
import { toComicModel } from "../../../../helpers/mappers";
import { ChapterSimple } from "../../../../model/chapters";
import { ComicModel } from "../../../../model/comic";
import { IComicScraper } from "../icomic-scraper";
import { RootScraper } from "../root-scraper";
import pLimit from "p-limit"

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
    async getComicBySlug(slug: string): Promise<ComicModel> {
        const htmlStrng = await httpClient.get(`https://kiryuu02.com/manga/${slug}`);
        const document = parseHTML(await htmlStrng.data);
        const id = document.querySelector(".seriestu.seriestere article")?.getAttribute("id")?.split("-")[1]
        const title = document.querySelector(".seriestuheader h1")?.textContent
        const alternativeTitle = document.querySelector("div.seriestualt")?.textContent.trim()
        const thumbnailURL = document.querySelector(".seriestucontent img")?.getAttribute("src")
        const followed = document.querySelector(".bmc")?.textContent
        const rating = document.querySelector(".seriestucontent .rating-prc .num")?.textContent
        const description = document.querySelector(".seriestucontentr [itemprop='description'] p")?.textContent.trim();
        const info: ComicInfo = { status: "", type: "", released: "", author: "", artist: "", serialization: "", postedBy: "",
            postedOn: "", updatedOn: "", views: "" };

        const genres: string[] = []
        const chapters: ChapterSimple[] = []
        const postViews = await httpClient.post(`https://kiryuu02.com/wp-admin/admin-ajax.php`, {
            action: "dynamic_view_ajax",
            post_id: id
        },
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Origin": "https://kiryuu02.com",
                "Referer": `https://kiryuu02.com/manga/` + slug, // optional
                "X-Requested-With": "XMLHttpRequest"
            }
        })
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
        info.views = await postViews.data.views
        document.querySelectorAll(".seriestugenre a").forEach(element => {
            genres.push(element?.textContent.toLowerCase())
        })
        document.querySelectorAll("#chapterlist li").forEach((element) => {
            chapters.push({
                title: element.querySelector(".eph-num a .chapternum")?.textContent ?? "",
                slug: element.querySelector(".eph-num a")?.getAttribute("href")?.split("/")[3] ?? "",
                created_at: element.querySelector(".eph-num .chapterdate")?.textContent ?? "",
                link: element.querySelector(".eph-num a")?.getAttribute("href") ?? ""
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
                genres: genres as [],
                status: info.status,
                author: info.author,
                artist: info.artist,
                views: info.views,
                followedCount: followed,
                created_at: info.postedOn,
                updated_at: info.updatedOn,
            }
        }) as ComicModel
    }
    async getComicLatest(pages: string): Promise<ComicModel[]> {
        const htmlStrng = await httpClient.get("https://kiryuu02.com/page/" + pages);
        const document = parseHTML(await htmlStrng.data);
        const comicContainers = document.querySelectorAll('.utao');
        if (!comicContainers || comicContainers.length === 0) {
            throw new ResponseError(404, "comic latest not found");
        }
        const limit = pLimit(10); // rate-limit 5 request per detik
        const comicsDatas = (await Promise.all(Array.from(comicContainers).map(async container =>
            limit(async () => {
                const title = container.querySelector('.bixbox h4')?.textContent?.trim() ?? "";
                const thumbnailUrl = container.querySelector(".imgu img")?.getAttribute("src")?.trim() ?? "";
                const type = container.querySelector('.luf ul')?.getAttribute("class")
                const id = container.querySelector('.imgu a')?.getAttribute("rel");
                const slug = container.querySelector(".luf a")?.getAttribute("href")?.split("/")[4] ?? "";
                const chaptersElement = container.querySelectorAll('.luf ul li')
                let updatedAt: string = ''
                const chapters:ChapterSimple[] = []
                chaptersElement.forEach((chapterElement, index) => {
                    chapters.push({
                        title: chapterElement.querySelector('a')?.textContent ?? "",
                        slug: chapterElement.querySelector("a")?.getAttribute("href")?.split("/")[3] ?? "",
                        link: chapterElement.querySelector("a")?.getAttribute("href") ?? "",
                        created_at: chapterElement.querySelector("span")?.textContent ?? ""
                    })
                    if (index == 0) {
                        updatedAt = chapterElement.querySelector("span")?.textContent ?? ""
                    }
                })
                // const scrapeFromMyanimelistSearch = await this.scrapeFromMyanimelistSearch(title)

                return toComicModel({
                    data: {
                        id: id ?? "",
                        slug,
                        title,
                        thumbnail_url: thumbnailUrl,
                        updated_at: updatedAt,
                        type: type ?? "",
                        chapters,
                        status: "ongoing"
                        // genres: scrapeFromMyanimelistSearch?.data?.genres ?? [],
                    }
                });
            })
        ))) as ComicModel[]
        
        return comicsDatas
    }
}