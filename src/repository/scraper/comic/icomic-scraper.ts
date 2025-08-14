import { ComicModel } from "../../../model/comic";

export interface IComicScraper {
    getComicLatest(): Promise<ComicModel[]>
    getComicDetail(slug: string): Promise<ComicModel>
}