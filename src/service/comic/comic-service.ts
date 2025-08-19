import { ComicResponse, toComicResponse, toComicResponseDetail, toComicResponses } from "../../dto/response/comic-response";
import { getScraper } from "../../repository/scraper/comic/factory-scraper";
import { IComicScraper } from "../../repository/scraper/comic/icomic-scraper";
import { IComicService } from "./icomic-service";

export class ComicService implements IComicService {
    constructor(private readonly repositoryComicScraper?: IComicScraper|null) {}
    async findBySlug(domain: string, slug: string): Promise<ComicResponse> {
        const scraper: IComicScraper = getScraper(domain);
        const comic = await scraper.getComicBySlug(slug)
        return toComicResponseDetail(comic)
    }
    async findAllLatest(domain: string, pages: string): Promise<ComicResponse[]> {
        const scraper: IComicScraper = getScraper(domain)
        const comics = await scraper.getComicLatest(pages);
        
        // const comics = await this.repositoryComicScraper?.getComicLatest()
        // for (const comic of comics) {
            // kalau mau save ke db
        // }
        return toComicResponses(comics)
    }
}