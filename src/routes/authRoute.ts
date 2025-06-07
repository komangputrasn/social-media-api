import authHandler from "@/handlers/authHandler";
import connection from "@/helpers/db";
import authValidator from "@/validators/authValidator";
import { RequestHandler, Router } from "express";
import { body } from "express-validator";
import { FieldPacket } from "mysql2";

const authRoute = Router();

authRoute.post(
  "/register",
  authValidator.registerValidator,
  authHandler.register
);
authRoute.post("/login", authValidator.loginValidator, authHandler.login);
authRoute.get("/access_token", authHandler.accessToken);

export default authRoute;
