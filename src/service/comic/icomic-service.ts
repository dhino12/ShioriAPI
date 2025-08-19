import { ComicResponse } from "../../dto/response/comic-response";

export interface IComicService {
    findAllLatest(domain: string, pages: string): Promise<ComicResponse[]>
    findBySlug(domain: string, slug: string): Promise<ComicResponse>
}