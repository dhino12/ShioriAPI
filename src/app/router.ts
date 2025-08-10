import express from 'express';
import { jwtAuthMiddleware } from '../middlewares/jwt-middleware';
import { errorMiddleware } from '../middlewares/error-middleware';
import { UserRepository } from '../repository/user/user-repository';
import { AuthService } from '../service/auth/auth-service';
import { AuthController } from '../controller/auth/auth-controller';
import cookieParser from 'cookie-parser';

const userRepo = new UserRepository();
const authService = new AuthService(userRepo);
const authController = new AuthController(authService);

// public routes (tidak butuh JWT)
export const publicRouter = express.Router();
publicRouter.post("/register", authController.register.bind(authController));
publicRouter.post("/login", authController.login.bind(authController));

// private routes (butuh JWT)
export const privateRouter = express.Router();
privateRouter.post("/logout", authController.logout.bind(authController))
privateRouter.post("/refreshtoken", authController.refreshToken.bind(authController))

const router = express();
// parsing JSON
router.use(express.json());

// cookie parser
router.use(cookieParser())

// register public routes
router.use("/api/v1", publicRouter);

// protect private routes dengan JWT
router.use(jwtAuthMiddleware);
router.use("/api/v1", privateRouter);

// error handler
router.use(errorMiddleware);

export default router
