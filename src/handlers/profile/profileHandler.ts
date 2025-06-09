import connection from "@/helpers/db";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import fs from "fs";

const createProfile = async (
  request: Request<{}, {}, CreateProfileBody>,
  response: Response
) => {
  const result = validationResult(request);
  const profilePicture = request.file?.filename;

  if (!result.isEmpty()) {
    response.status(400).json({
      errors: result.array(),
    });

    // remove the uploaded file
    fs.unlinkSync(`assets/profile_picture/${profilePicture}`);

    return;
  }

  const { accountId, name, username, description } = request.body;

  await connection.query(
    "insert into account_detail(account_id, name, username, profile_picture, description) values (?, ?, ?, ?, ?)",
    [accountId, name, username, profilePicture, description]
  );

  response.json({
    message: "Profile created successfully!",
  });
};

const profileDetails = async (
  request: Request<{ user_id: string }, {}, CreateProfileBody>,
  response: Response
) => {
  const [detail] = await connection.query(
    "select * from account_detail where account_id = ?",
    [request.params["user_id"]]
  );

  if (detail.length == 0) {
    response.status(404).json({
      message: `User for id = ${request.params["user_id"]} not found`,
    });
    return;
  }

  response.json(detail[0]);
};

export default {
  createProfile,
  profileDetails,
};
