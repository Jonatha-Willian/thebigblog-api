import { Router } from "express";
import * as authController from "../controllers/authController";
import { privateRoute } from "../middlewares/private-route";

export const authRoutes = Router();

authRoutes.post("/signup", authController.signup);
authRoutes.post("/signin", authController.signin);
authRoutes.post("/validate", privateRoute, authController.validate);

