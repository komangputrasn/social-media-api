import authHandler from "@/handlers/authHandler";
import { RequestHandler, Router } from "express";
import { body } from "express-validator";

const authRoute = Router();

const registerValidator = [
  body("email").notEmpty().withMessage("Email is required"),
  body("email").isEmail().withMessage("Email format is incorrect"),
  body("password").notEmpty().withMessage("Password is required"),
  body("password")
    .isLength({ min: 10 })
    .withMessage("Password must have at least 10 characters"),
  body("confirm_password")
    .notEmpty()
    .withMessage("Confirm password is required"),
  body("confirm_password")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Password confirmation does not match"),
];

authRoute.post("/register", registerValidator, 

(request: Request, response: Response) => {
  const result = validationResult(request);

  if (!result.isEmpty()) {
    return response.status(403).json({
      errors: result.array({ onlyFirstError: true }),
    });
  }
  return response.json({
    message: "Register Success!",
    status: "success",
    data: request.body,
  })

);

export default authRoute;
