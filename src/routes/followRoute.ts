import followHandler from "@/handlers/follow/followHandler";
import verifyToken from "@/middlewares/verifyToken";
import { Router } from "express";

const followRoute = Router();

followRoute.post("/:user_id", verifyToken, followHandler.follow);

export default followRoute;
