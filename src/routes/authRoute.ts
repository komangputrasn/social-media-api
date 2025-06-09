import authHandler from "@/handlers/auth/authHandler";
import authValidator from "@/validators/authValidator";
import { Router } from "express";

const authRoute = Router();

authRoute.post(
  "/register",
  authValidator.registerValidator,
  authHandler.register
);
authRoute.post("/login", authValidator.loginValidator, authHandler.login);
authRoute.get("/access_token", authHandler.accessToken);

export default authRoute;
