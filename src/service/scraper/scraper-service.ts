import { ChapterResponse, toChapterResponse, toChapterResponses } from "../../dto/response/chapter-response";
import {
    ComicResponse,
    toComicResponse,
    toComicResponseDetail,
    toComicResponses,
} from "../../dto/response/comic-response";
import { EpisodeResponse, toEpisodeResponses } from "../../dto/response/episode-response";
import { GenreResponse, toGenreResponse, toGenreResponses } from "../../dto/response/genre-response";
import { getScraper } from "../../repository/scraper/factory-scraper";
import { IComicScraper } from "../../repository/scraper/icomic-scraper";
import { IScraperService } from "./iscraper-service";

export class ScraperService implements IScraperService {
    constructor(private readonly repositoryComicScraper?: IComicScraper | null) {}
    async findTextListComics(domain: string, pages: string): Promise<ComicResponse[]> {
        const scraper:IComicScraper = getScraper(domain)
        const textComics = await scraper.getTextListComics(pages)
        return toComicResponses(textComics)
    }
    async findEpisodesByChapterSlug(domain: string, slug: string): Promise<EpisodeResponse[]> {
        const scraper:IComicScraper = getScraper(domain)
        const episodes = await scraper.getEpisodesByChapterSlug(slug)
        return toEpisodeResponses(episodes)
    }
    async findChapterBySlug(domain: string, slug: string): Promise<ChapterResponse> {
        const scraper:IComicScraper = getScraper(domain)
        const chapter = await scraper.getChapterBySlug(slug)
        return toChapterResponse(chapter)
    }
    async findChapterByComicSlug(domain: string, slug: string): Promise<ChapterResponse[]> {
        const scraper:IComicScraper = getScraper(domain)
        const chapters = await scraper.getChaptersByComicSlug(slug)
        return toChapterResponses(chapters)
    }
    async findComics(domain: string, genresId: string[], status: string, type: string, order: string, page: string): Promise<ComicResponse[]> {
        const scraper:IComicScraper = getScraper(domain)
        const comics = await scraper.getComics(page, genresId, status, type, order)
        return toComicResponses(comics)
    }
    async findComicsByGenreSlug(domain: string, slug: string, page: string): Promise<GenreResponse> {
        const scraper:IComicScraper = getScraper(domain)
        const genre = await scraper.getComicsByGenreSlug(slug, page)
        return toGenreResponse(genre)
    }
    async findAllGenre(domain: string): Promise<GenreResponse[]> {
        const scraper: IComicScraper = getScraper(domain)
        const genres = await scraper.getGenres()
        return toGenreResponses(genres)
    }
    async findBySlug(domain: string, slug: string): Promise<ComicResponse> {
        const scraper: IComicScraper = getScraper(domain);
        const comic = await scraper.getComicBySlug(slug);
        return toComicResponseDetail(comic);
    }
    async findAllLatest(domain: string,pages: string): Promise<ComicResponse[]> {
        const scraper: IComicScraper = getScraper(domain);
        const comics = await scraper.getComicLatest(pages);

        // const comics = await this.repositoryComicScraper?.getComicLatest()
        // for (const comic of comics) {
        // kalau mau save ke db
        // }
        return toComicResponses(comics);
    }
}
