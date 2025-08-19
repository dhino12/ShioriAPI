import { ComicModel } from "../../../model/comic";

export interface IComicScraper {
    getComicLatest(pages: string): Promise<ComicModel[]>
    getComicBySlug(slug: string): Promise<ComicModel>
}