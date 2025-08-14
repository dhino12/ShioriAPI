import { ComicResponse } from "../../dto/response/comic-response";

export interface IComicService {
    findAllLatest(domain: string): Promise<ComicResponse[]>
}