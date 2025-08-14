import { NextFunction, Response, Request } from "express";
import { IComicService } from "../../service/comic/icomic-service";
import { IComicController } from "./icomic-controller";
import { IComicScraper } from "../../repository/scraper/comic/icomic-scraper";
import { getScraper } from "../../repository/scraper/comic/factory-scraper";

export class ComicController implements IComicController {
    constructor(private readonly service: IComicService) {}
    async findAllLatest(req: Request, res: Response, next: NextFunction): Promise<void> {
        const {domain} = req.params
        const comics = await this.service.findAllLatest(domain)
        
        res.status(200).json({
            code: 200,
            status: "success",
            data: comics
        })
    }
}