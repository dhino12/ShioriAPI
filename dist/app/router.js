"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.privateRouter = exports.publicRouter = void 0;
const express_1 = __importDefault(require("express"));
const jwt_middleware_1 = require("../middlewares/jwt-middleware");
const error_middleware_1 = require("../middlewares/error-middleware");
const user_repository_1 = require("../repository/db/user/user-repository");
const auth_service_1 = require("../service/auth/auth-service");
const auth_controller_1 = require("../controller/auth/auth-controller");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const bookmark_repository_1 = require("../repository/db/bookmark/bookmark-repository");
const bookmark_service_1 = require("../service/bookmark/bookmark-service");
const bookmark_controller_1 = require("../controller/bookmark/bookmark-controller");
const comic_controller_1 = require("../controller/comic/comic-controller");
const scraper_service_1 = require("../service/scraper/scraper-service");
const userRepo = new user_repository_1.UserRepository();
const authService = new auth_service_1.AuthService(userRepo);
const authController = new auth_controller_1.AuthController(authService);
const bookmarkRepo = new bookmark_repository_1.BookmarkRepository();
const bookmarkService = new bookmark_service_1.BookmarkService(bookmarkRepo);
const bookmarkController = new bookmark_controller_1.BookmarkController(bookmarkService);
const comicService = new scraper_service_1.ScraperService(null);
const comicController = new comic_controller_1.ComicController(comicService);
// public routes (tidak butuh JWT)
exports.publicRouter = express_1.default.Router();
exports.publicRouter.post("/register", authController.register.bind(authController));
exports.publicRouter.post("/login", authController.login.bind(authController));
exports.publicRouter.get("/:domain/comics/list-mode", comicController.findTextListComics.bind(comicController));
exports.publicRouter.get("/:domain/comics", comicController.findComics.bind(comicController));
exports.publicRouter.get("/:domain/comics/latest", comicController.findAllLatest.bind(comicController));
exports.publicRouter.get("/:domain/comics/:slug", comicController.findBySlug.bind(comicController));
exports.publicRouter.get("/:domain/genres", comicController.findAllGenres.bind(comicController));
exports.publicRouter.get("/:domain/genres/:slug/comics", comicController.findComicsByGenreSlug.bind(comicController));
exports.publicRouter.get("/:domain/comics/:slug/chapters", comicController.findChaptersByComicSlug.bind(comicController));
exports.publicRouter.get("/:domain/comics/:slug/chapters/:slugchapter", comicController.findChapterBySlug.bind(comicController));
exports.publicRouter.get("/:domain/comics/:slug/chapters/:slugchapter/episodes", comicController.findEpisodesByChapterSlug.bind(comicController));
// private routes (butuh JWT)
exports.privateRouter = express_1.default.Router();
exports.privateRouter.post("/logout", authController.logout.bind(authController));
exports.privateRouter.post("/refreshtoken", authController.refreshToken.bind(authController));
exports.privateRouter.post("/bookmark", bookmarkController.create.bind(bookmarkController));
exports.privateRouter.delete("/bookmark/:id", bookmarkController.delete.bind(bookmarkController));
exports.privateRouter.get("/bookmark/:id", bookmarkController.findById.bind(bookmarkController));
exports.privateRouter.get("/bookmark", bookmarkController.findAllByUserId.bind(bookmarkController));
const router = (0, express_1.default)();
router.use(express_1.default.json()); // parsing json
router.use((0, cookie_parser_1.default)()); // cookie parser
router.use("/api/v1", exports.publicRouter); // public routes access
router.use(jwt_middleware_1.jwtAuthMiddleware); // protect private routes dengan JWT
router.use("/api/v1", exports.privateRouter); // private routes access
router.use(error_middleware_1.errorMiddleware); // error handler
exports.default = router;
