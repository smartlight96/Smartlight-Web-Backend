import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDirectory =
  path.join(
    process.cwd(),
    "uploads",
    "resumes"
  );

if (
  !fs.existsSync(
    uploadDirectory
  )
) {
  fs.mkdirSync(
    uploadDirectory,
    {
      recursive: true,
    }
  );
}

const storage =
  multer.diskStorage({
    destination:
      (
        _req,
        _file,
        callback
      ) => {
        callback(
          null,
          uploadDirectory
        );
      },

    filename:
      (
        _req,
        file,
        callback
      ) => {
        const extension =
          path.extname(
            file.originalname
          );

        const safeName =
          path
            .basename(
              file.originalname,
              extension
            )
            .replace(
              /[^a-zA-Z0-9-_]/g,
              "-"
            );

        const filename =
          `${safeName}-${Date.now()}${extension}`;

        callback(
          null,
          filename
        );
      },
  });

const fileFilter:
  multer.Options["fileFilter"] =
  (_req, file, callback) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (
      allowedTypes.includes(
        file.mimetype
      )
    ) {
      callback(null, true);
    } else {
      callback(
        new Error(
          "Only PDF, DOC and DOCX resumes are allowed."
        )
      );
    }
  };

export const careerUpload =
  multer({
    storage,

    fileFilter,

    limits: {
      fileSize:
        5 * 1024 * 1024,
    },
  });