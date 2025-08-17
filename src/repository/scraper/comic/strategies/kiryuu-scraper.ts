import { httpClient } from "../../../../app/http-client";
import { parseHTML } from "../../../../app/scraper";
import { ResponseError } from "../../../../error/response-error";
import { toComicModel } from "../../../../helpers/mappers";
import { ChapterSimple } from "../../../../model/chapters";
import { ComicModel } from "../../../../model/comic";
import { IComicScraper } from "../icomic-scraper";
import { RootScraper } from "../root-scraper";
import pLimit from "p-limit"

export class KiryuuScraper extends RootScraper implements IComicScraper {
    async getComicDetail(slug: string): Promise<ComicModel> {
        throw new Error("Method not implemented.");
    }
    async getComicLatest(): Promise<ComicModel[]> {
        const htmlStrng = await httpClient.get("https://kiryuu02.com");
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
                        id,
                        slug,
                        title,
                        thumbnail_url: thumbnailUrl,
                        updated_at: updatedAt,
                        type,
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