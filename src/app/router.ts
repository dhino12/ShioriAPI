import express from "express";
import { NextFunction, Response, Request } from "express";
import { jwtAuthMiddleware } from "../middlewares/jwt-middleware";
import { errorMiddleware } from "../middlewares/error-middleware";
import { UserRepository } from "../repository/db/user/user-repository";
import { AuthService } from "../service/auth/auth-service";
import { AuthController } from "../controller/auth/auth-controller";
import cookieParser from "cookie-parser";
import { BookmarkRepository } from "../repository/db/bookmark/bookmark-repository";
import { BookmarkService } from "../service/bookmark/bookmark-service";
import { BookmarkController } from "../controller/bookmark/bookmark-controller";
import { ComicController } from "../controller/comic/comic-controller";
import { ScraperService } from "../service/scraper/scraper-service";
import cors from "cors";

const userRepo = new UserRepository();
const authService = new AuthService(userRepo);
const authController = new AuthController(authService);

const bookmarkRepo = new BookmarkRepository();
const bookmarkService = new BookmarkService(bookmarkRepo);
const bookmarkController = new BookmarkController(bookmarkService);

const comicService = new ScraperService(null);
const comicController = new ComicController(comicService);

// public routes (tidak butuh JWT)
export const publicRouter = express.Router();
publicRouter.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        code: 200,
        status: "success",
        data: {
            message: "Hello World"
        }
    })
});
publicRouter.post("/register", authController.register.bind(authController));
publicRouter.post("/login", authController.login.bind(authController));
publicRouter.get("/:domain/comics/list-mode",comicController.findTextListComics.bind(comicController));
publicRouter.get("/:domain/comics", comicController.findComics.bind(comicController))
publicRouter.get("/:domain/comics/latest",comicController.findAllLatest.bind(comicController));
publicRouter.get("/:domain/comics/:slug",comicController.findBySlug.bind(comicController));
publicRouter.get("/:domain/genres", comicController.findAllGenres.bind(comicController))
publicRouter.get("/:domain/genres/:slug/comics", comicController.findComicsByGenreSlug.bind(comicController))
publicRouter.get("/:domain/comics/:slug/chapters", comicController.findChaptersByComicSlug.bind(comicController))
publicRouter.get("/:domain/comics/:slug/chapters/:slugchapter", comicController.findChapterBySlug.bind(comicController))
publicRouter.get("/:domain/comics/:slug/chapters/:slugchapter/episodes", comicController.findEpisodesByChapterSlug.bind(comicController))

// private routes (butuh JWT)
export const privateRouter = express.Router();
privateRouter.post("/logout", authController.logout.bind(authController));
privateRouter.post("/refreshtoken",authController.refreshToken.bind(authController));

privateRouter.post("/bookmark",bookmarkController.create.bind(bookmarkController));
privateRouter.delete("/bookmark/:id",bookmarkController.delete.bind(bookmarkController));
privateRouter.get("/bookmark/:id",bookmarkController.findById.bind(bookmarkController));
privateRouter.get("/bookmark",bookmarkController.findAllByUserId.bind(bookmarkController));

const router = express();
router.use(express.json()); // parsing json
router.use(cookieParser()); // cookie parser
router.use(cors())

router.use("/api/v1", publicRouter); // public routes access

router.use(jwtAuthMiddleware); // protect private routes dengan JWT
router.use("/api/v1", privateRouter); // private routes access

router.use(errorMiddleware); // error handler

export default router;
