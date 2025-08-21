import { ChapterModel } from "../../model/chapters";
import { ComicModel } from "../../model/comic";
import { EpisodeModel } from "../../model/episode";
import { GenreModel } from "../../model/genre";

export interface IComicScraper {
    getComics(pages: string, genreId: string[], status: string, type: string, order: string): Promise<ComicModel[]>;
    getTextListComics(page: string): Promise<ComicModel[]>
    getComicLatest(pages: string): Promise<ComicModel[]>;
    getComicBySlug(slug: string): Promise<ComicModel>;
    getComicsByGenreSlug(slug: string, page: string): Promise<GenreModel>
    getGenres(): Promise<GenreModel[]>
    getChaptersByComicSlug(slug: string): Promise<ChapterModel[]>
    getChapterBySlug(slug: string): Promise<ChapterModel>
    getEpisodesByChapterSlug(slug: string): Promise<EpisodeModel[]>
}
