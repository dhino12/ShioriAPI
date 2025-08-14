import { ResponseError } from "../../../error/response-error";
import { IComicScraper } from "./icomic-scraper";
import { KiryuuScraper } from "./strategies/kiryuu-scraper";

export function getScraper(domain:string): IComicScraper {
    switch (true) {
        case domain.includes("kiryuu"):
            return new KiryuuScraper()
        default:
            throw new ResponseError(404, "No scraper available for this domain") 
    }
}