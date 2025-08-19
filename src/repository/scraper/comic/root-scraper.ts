import { httpClient } from "../../../app/http-client";
import { parseHTML } from "../../../app/scraper";
import { getTextAfterLabel } from "../../../helpers/scrape-helper";
import { ComicModel } from "../../../model/comic";
import { IComicScraper } from "./icomic-scraper";

export abstract class RootScraper implements IComicScraper {
    getComicLatest(pages: string): Promise<ComicModel[]> {
        throw new Error("Method not implemented.");
    }
    getComicBySlug(slug: string): Promise<ComicModel> {
        throw new Error("Method not implemented.");
    }
    protected async scrapeMangaSearchHover(id: string) {
        const searchUrl = `https://myanimelist.net/manga/${encodeURIComponent(id)}/hover`;
        const response = await httpClient.get(searchUrl);
        const document = parseHTML(response.data);
        return {
            genres: getTextAfterLabel(document, "Genres:"),
            status: getTextAfterLabel(document, "Status:"),
            score: getTextAfterLabel(document, "Score:"),
            ranked: getTextAfterLabel(document, "Ranked:")
        };
    }
    protected async scrapeFromMyanimelistSearch(title: string) {
        try {
            const searchUrl = `https://myanimelist.net/manga.php?q=${encodeURIComponent(title)}`;
            const documentHTML = await httpClient.get(searchUrl);
            const dataHTML = await documentHTML.data
            
            if (!dataHTML) return
            const searchDocument = parseHTML(dataHTML);
            const sareaElement = searchDocument.querySelector('[id^="sarea"]');
            const malId = sareaElement?.id.replace(/\D/g, "") ?? null;
            if (malId == null) return { status: "myanimelist-id not found" }
            const resultSearchAttribute = await this.scrapeMangaSearchHover(malId);
            return {
                status: "success",
                data: {
                    genres: resultSearchAttribute.genres?.split(","),
                    status: resultSearchAttribute.status,
                    score: resultSearchAttribute.score,
                    ranked: resultSearchAttribute.ranked,
                },
            };
        } catch (error) {
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
    }
}