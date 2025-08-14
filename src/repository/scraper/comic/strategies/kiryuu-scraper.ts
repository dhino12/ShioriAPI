import { httpClient } from "../../../../app/http-client";
import { parseHTML } from "../../../../app/scraper";
import { ResponseError } from "../../../../error/response-error";
import { toComicModel } from "../../../../helpers/mappers";
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
        const limit = pLimit(5); // rate-limit 5 request per detik
        const comicsDatas = (await Promise.all(Array.from(comicContainers).map(async container =>
            limit(async () => {
                const title = container.querySelector('.bixbox h4')?.textContent?.trim() ?? "";
                const thumbnailUrl = container.querySelector(".imgu img")?.getAttribute("src")?.trim() ?? "";
                const type = container.querySelector('.luf ul')?.getAttribute("class")
                // const sareaElement = searchDocument.querySelector('[id^="sarea"]');
                // const malId = sareaElement?.id.replace(/\D/g, "") ?? null;
                // console.log(title, thumbnailUrl, " < ================== >", type);
                // const scrapeFromMyanimelistSearch = await this.scrapeFromMyanimelistSearch(title)

                return toComicModel({
                    data: {
                        title,
                        thumbnail_url: thumbnailUrl,
                        type,
                        status: "ongoing"
                        // genres: scrapeFromMyanimelistSearch?.data?.genres ?? [],
                    }
                });
            })
        ))) as ComicModel[]
        // console.log(comicsDatas);
        
        return comicsDatas
    }
}