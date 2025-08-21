import { NextFunction, Response, Request } from "express";

export interface IComicController {
    findTextListComics(req: Request, res: Response, next: NextFunction): Promise<void>
    findAllLatest(req: Request, res: Response, next: NextFunction): Promise<void>
    findBySlug(req: Request, res: Response, next: NextFunction): Promise<void>
    findAllGenres(req: Request, res: Response, next: NextFunction): Promise<void>
    findComicsByGenreSlug(req: Request, res: Response, next: NextFunction): Promise<void>
    findComics(req: Request, res: Response, next: NextFunction): Promise<void>
    findChaptersByComicSlug(req: Request, res: Response, next: NextFunction): Promise<void>
    findChapterBySlug(req: Request, res: Response, next: NextFunction): Promise<void>
    findEpisodesByChapterSlug(req: Request, res: Response, next: NextFunction): Promise<void>
}