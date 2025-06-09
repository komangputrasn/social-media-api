import { format } from "date-fns";
import multer from "multer";
import connection from "./helpers/db";

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    let path = "assets/";
    if (file.fieldname === "profilePicture") {
      path += "profile_picture/";
    }
    callback(null, path);
  },
  filename: (request, file, callback) => {
    const fileExtension = file.mimetype.split("/").at(-1);
    let fileName = "";
    if (file.fieldname === "profilePicture") {
      fileName = `profilePicture-${format(
        new Date(),
        "yyyymmddhhmmss"
      )}.${fileExtension}`;
    }

    callback(null, fileName);
  },
});

const upload = multer({
  storage: storage,
});

export default upload;
