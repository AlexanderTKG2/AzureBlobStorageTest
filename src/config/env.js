require("dotenv").config();
require("process");

const env = {
  api: {
    port: process.env.PORT || 5005,
    host: process.env.HOST || "0.0.0.0",
    protocol: process.env.PROTOCOL,
    stage: process.env.STAGE,
    filesUrl: process.env.FILES_URL,
  },
  blobStorage: {
    connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
    filesContainer: process.env.FILES_CONTAINER,
  },
};

module.exports = env;
