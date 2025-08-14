import axios from "axios";
import { JSDOM } from "jsdom";
import pLimit from "p-limit";
export function getTextAfterLabel(container, label) {
  // Cari semua elemen dengan class "dark_text"
    const labelElements = Array.from(container.querySelectorAll(".dark_text"));
    
    // Cari elemen yang textContent-nya diawali label (misal "Genres:")
    const labelEl = labelElements.find(el => el.textContent?.trim().startsWith(label));
    if (!labelEl) return null;

    let value = "";
    let node = labelEl.nextSibling;

    while (node) {
        if (node.nodeType === 3) { 
            // TEXT_NODE
            value += node.textContent;
        }
        if (node.nodeName === "BR") break; // berhenti kalau ketemu <br>
        node = node.nextSibling;
    }

    return value.replace(/\s+/g, "");
}
export const httpClient = axios.create({
    timeout: 10000,
    headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MyScraper/1.0)",
        "Accept-Language": "en-US,en;q=0.9",
    },
});
export function parseHTML(html) {
    const dom = new JSDOM(html);
    return dom.window.document;
}

class RootScraper {
    getComicLatest() {
        throw new Error("Method not implemented.");
    }
    getComicDetail(slug) {
        throw new Error("Method not implemented.");
    }
    async scrapeMangaSearchHover(id) {
        const searchUrl = `https://myanimelist.net/manga/${encodeURIComponent(id)}/hover`;
        const response = await httpClient.get(searchUrl);
        const document = parseHTML(response.data);
        return {
            genres: getTextAfterLabel(document, "Genres:"),
            status: getTextAfterLabel(document, "Status:"),
            score: getTextAfterLabel(document, "Score:"),
            ranked: getTextAfterLabel(document, "Ranked:"),
        };
    }
    async scrapeFromMyanimelistSearch(title) {
        try {
            const searchUrl = `https://myanimelist.net/manga.php?q=${encodeURIComponent(title)}`;
            const documentHTML = await httpClient.get(searchUrl);
            
            if (!documentHTML.data) {
                return
            };
            const searchDocument = parseHTML(documentHTML.data);
            const sareaElement = searchDocument.querySelector('[id^="sarea"]');
            const malId = sareaElement?.id.replace(/\D/g, "") ?? null;
            if (malId == null) {
                return { status: "myanimelist-id not found" };
            }
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

class KiryuuScraper extends RootScraper {
    async getComicDetail(slug) {
        throw new Error("Method not implemented.");
    }
    async getComicLatest() {
        const htmlStrng = await httpClient.get("https://kiryuu02.com");
        const document = parseHTML(htmlStrng.data);
        const comicContainers = document.querySelectorAll(".utao");
        if (!comicContainers || comicContainers.length === 0) {
            throw new ResponseError(404, "comic latest not found");
        }
        const limit = pLimit(5); // rate-limit 5 request per detik
        const comicsDatas = await Promise.all(
            Array.from(comicContainers).map((container) =>
                limit(async () => {
                    const title = container.querySelector(".bixbox h4")?.textContent?.trim() ?? "";
                    const thumbnailUrl = container.querySelector(".imgu img")?.getAttribute("src")?.trim() ?? "";
                    const scrapeFromMyanimelistSearch = await this.scrapeFromMyanimelistSearch(title);
                    console.log(title, " <===> ", scrapeFromMyanimelistSearch.data.genres ?? []);
                    
                    return {
                        data: {
                            title,
                            thumbnail_url: thumbnailUrl,
                            genres: scrapeFromMyanimelistSearch?.data?.genres ?? [],
                        },
                    };
                })
            )
        );
        return comicsDatas;
    }
}

(async () => {
    try {
    const data = new KiryuuScraper()
    const comics = await data.getComicLatest();
    // console.log(comics);
    } catch (error) {
        console.error(error);
    }
})();

// startParse()
// startMAL()
