import { ComicResponse, toComicResponse, toComicResponses } from "../../dto/response/comic-response";
import { getScraper } from "../../repository/scraper/comic/factory-scraper";
import { IComicScraper } from "../../repository/scraper/comic/icomic-scraper";
import { IComicService } from "./icomic-service";

export class ComicService implements IComicService {
    constructor(private readonly repositoryComicScraper?: IComicScraper|null) {}
    async findAllLatest(domain: string): Promise<ComicResponse[]> {
        const scraper: IComicScraper = getScraper(domain)
        const comics = await scraper.getComicLatest();
        
        // const comics = await this.repositoryComicScraper?.getComicLatest()
        // for (const comic of comics) {
            // kalau mau save ke db
        // }
        return toComicResponses(comics)
    }
}