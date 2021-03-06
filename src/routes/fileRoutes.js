const express = require("express");
const router = express.Router();
const multer = require("multer");
const BlobStorageService = require("@/src/services/blobStorageService");

const upload = multer();

router.get("/generate-upload-url", (req, res) => {
  res.header("Content-Type", "application/json");
  try {
    BlobStorageService.generateBlobSASUpload(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:filename", (req, res) =>
  BlobStorageService.getDisplayFile(req, res)
);

router.get("/:filename/download", (req, res) =>
  BlobStorageService.getFileBufferData(req, res)
);

router.post("/upload", upload.array("files"), (req, res) =>
  BlobStorageService.uploadFileArray(req, res)
);

router.delete("/:filename", (req, res) =>
  BlobStorageService.deleteFile(req, res)
);

module.exports = {
  FilesRouter: router,
};
