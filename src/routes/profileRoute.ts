import profileHandler from "@/handlers/profile/profileHandler";
import verifyToken from "@/middlewares/verifyToken";
import upload from "@/upload";
import profileValidator from "@/validators/profileValidator";
import express, { Router } from "express";
const profileRoute = Router();

profileRoute.post(
  "/:user_id",
  verifyToken,
  upload.single("profilePicture"),
  profileValidator.createProfileValidator,
  profileHandler.createProfile
);

profileRoute.get("/:user_id", verifyToken, profileHandler.profileDetails);

export default profileRoute;
