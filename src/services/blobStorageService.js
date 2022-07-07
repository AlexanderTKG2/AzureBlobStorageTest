require("module-alias/register");
const { BlobServiceClient } = require("@azure/storage-blob");
const uuid = require("uuid");
const env = require("@/src/config/env");

class BlobStorageService {
  constructor() {
    this.connectionString = env.blobStorage.connectionString;
    this.blobService = BlobServiceClient.fromConnectionString(
      this.connectionString
    );
  }

  async uploadFileArray(req, res) {
    try {
      const Files = req.files;

      const container = env.blobStorage.filesContainer;
      const containerClient = this.blobService.getContainerClient(container);

      const responseArray = [];
      for (const file of Files) {
        const fileUrlObject = await this.uploadSingleFile(
          file,
          containerClient
        );
        if (fileUrlObject) {
          responseArray.push(fileUrlObject);
        }
      }
      res.status(200).json({ status: "Ok", data: responseArray });
    } catch (error) {
      res.status(500).json({ status: "Server Error", error: error.message });
    }
  }

  async uploadSingleFile(file, containerClient) {
    try {
      const fileName = file.originalname || "upload.png";
      const remoteFileName = `${uuid.v4()}-${fileName}`;
      const blockClient = await containerClient.getBlockBlobClient(
        remoteFileName
      );

      await blockClient.uploadData(file.buffer);

      const fileUrlAbsolute = blockClient.url;

      const fileUrlRelative = new URL(remoteFileName, env.api.filesUrl).href;
      return {
        relativeUrl: fileUrlRelative,
        absoluteUrl: fileUrlAbsolute,
      };
    } catch (error) {
      return undefined;
    }
  }

  async getDisplayFile(req, res) {
    try {
      res.header("Content-Type", "image/png");
      const filename = req.params.filename;

      const container = env.blobStorage.filesContainer;

      const containerClient = this.blobService.getContainerClient(container);

      if (!filename) {
        throw new Error("400: Filename not provided");
      }
      const blockBlobClient = await containerClient.getBlockBlobClient(
        filename
      );
      const response = await blockBlobClient.downloadToBuffer();

      res.send(response);
    } catch (error) {
      res.status(500).json({ status: "Server Error", error: error.message });
    }
  }

  async deleteFile(req, res) {
    try {
      const filename = req.params.filename;

      if (!filename) {
        throw new Error("400: Filename not provided");
      }

      const container = env.blobStorage.filesContainer;
      const containerClient = this.blobService.getContainerClient(container);
      const response = await containerClient
        .getBlockBlobClient(filename)
        .deleteIfExists();

      res.status(200).send({ status: "Ok" });
    } catch (error) {
      res.status(500).json({ status: "Server Error", error: error.message });
    }
  }

  async getFileBufferData(req, res) {
    try {
      const fileName = req.params.filename;
      const container = env.blobStorage.filesContainer;

      if (!fileName) {
        throw new Error("400: Filename not provided");
      }

      const containerClient = this.blobService.getContainerClient(container);
      const blockBlobClient = await containerClient.getBlockBlobClient(
        fileName
      );

      const fileBufferData = blockBlobClient.downloadToBuffer();

      res.send(fileBufferData);
    } catch (error) {
      res.status(500).json({ status: "Server Error", error: error.message });
    }
  }
}

const blobStorageService = new BlobStorageService();

module.exports = blobStorageService;
