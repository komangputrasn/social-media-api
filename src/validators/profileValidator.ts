import connection from "@/helpers/db";
import { body, header } from "express-validator";
import { FieldPacket } from "mysql2";
import fs from "fs";

const createProfileValidator = [
  body("accountId")
    .notEmpty()
    .withMessage("Account ID is required")
    .custom(async (accountId) => {
      const [result] = await connection.query(
        "select * from account where id = ?",
        [accountId]
      );

      if (result.length == 0) {
        throw Error(
          `Account ID does not exists. Please perform a registration for id = ${accountId}`
        );
      }
    }),
  body("name").notEmpty().withMessage("Name is required"),
  body("username").notEmpty().withMessage("Username is required"),
  body("username").custom(async (username, { req }) => {
    const [result] = await connection
      .query("select username from account_detail where username = ?", [
        username,
      ])
      .then((res) => res as [any[], FieldPacket[]]);

    if (result.length > 0) {
      console.log(req.body);
      // fs.unlinkSync(`assets/profile_picture/${}`);
      throw new Error("Username is taken");
    }
  }),
  body("description").notEmpty().withMessage("Description is required"),
  header("Authorization")
    .notEmpty()
    .withMessage("Authorization header is required"),
];

export default {
  createProfileValidator,
};
