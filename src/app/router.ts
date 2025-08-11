import express from 'express';
import { jwtAuthMiddleware } from '../middlewares/jwt-middleware';
import { errorMiddleware } from '../middlewares/error-middleware';
import { UserRepository } from '../repository/user/user-repository';
import { AuthService } from '../service/auth/auth-service';
import { AuthController } from '../controller/auth/auth-controller';
import cookieParser from 'cookie-parser';
import { BookmarkRepository } from '../repository/bookmark/bookmark-repository';
import { BookmarkService } from '../service/bookmark/bookmark-service';
import { BookmarkController } from '../controller/bookmark/bookmark-controller';

const userRepo = new UserRepository();
const authService = new AuthService(userRepo);
const authController = new AuthController(authService);

const bookmarkRepo = new BookmarkRepository();
const bookmarkService = new BookmarkService(bookmarkRepo);
const bookmarkController = new BookmarkController(bookmarkService);

// public routes (tidak butuh JWT)
export const publicRouter = express.Router();
publicRouter.post("/register", authController.register.bind(authController));
publicRouter.post("/login", authController.login.bind(authController));

// private routes (butuh JWT)
export const privateRouter = express.Router();
privateRouter.post("/logout", authController.logout.bind(authController))
privateRouter.post("/refreshtoken", authController.refreshToken.bind(authController))

privateRouter.post("/bookmark", bookmarkController.create.bind(bookmarkController))
privateRouter.delete("/bookmark/:id", bookmarkController.delete.bind(bookmarkController))
privateRouter.get("/bookmark/:id", bookmarkController.findById.bind(bookmarkController))
privateRouter.get("/bookmark", bookmarkController.findAllByUserId.bind(bookmarkController))

const router = express();
router.use(express.json()); // parsing json
router.use(cookieParser()); // cookie parser

router.use("/api/v1", publicRouter); // public routes access

router.use(jwtAuthMiddleware); // protect private routes dengan JWT
router.use("/api/v1", privateRouter); // private routes access

router.use(errorMiddleware); // error handler

export default router
