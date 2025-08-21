import { ChapterResponse } from "../../dto/response/chapter-response";
import { ComicResponse } from "../../dto/response/comic-response";
import { EpisodeResponse } from "../../dto/response/episode-response";
import { GenreResponse } from "../../dto/response/genre-response";

export interface IScraperService {
    findAllLatest(domain: string, pages: string): Promise<ComicResponse[]>
    findBySlug(domain: string, slug: string): Promise<ComicResponse>
    findTextListComics(domain: string, pages: string): Promise<ComicResponse[]>
    findAllGenre(domain: string): Promise<GenreResponse[]>
    findComicsByGenreSlug(domain: string, slug: string, page: string): Promise<GenreResponse>
    findComics(domain: string, genresId: string[], status: string, type: string, order: string, page: string): Promise<ComicResponse[]> 
    findChapterByComicSlug(domain: string, slug: string): Promise<ChapterResponse[]>
    findChapterBySlug(domain: string, slug: string): Promise<ChapterResponse>
    findEpisodesByChapterSlug(domain: string, slug: string): Promise<EpisodeResponse[]>
}