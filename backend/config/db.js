const mongoose = require("mongoose");

const LOCAL_MONGO_URI = "mongodb://127.0.0.1:27017/newpaper";

let databaseConnected = false;
let databaseMode = "memory";

const tryConnect = async (uri) => {
  const connection = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });

  databaseConnected = true;
  databaseMode = "mongo";
  console.log(`MongoDB connected: ${connection.connection.host}`);

  return connection;
};

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI;
  const urisToTry = primaryUri && primaryUri !== LOCAL_MONGO_URI
    ? [primaryUri, LOCAL_MONGO_URI]
    : [primaryUri || LOCAL_MONGO_URI];

  for (const uri of urisToTry) {
    try {
      return await tryConnect(uri);
    } catch (error) {
      databaseConnected = false;
      databaseMode = "memory";
      console.error("MongoDB connection failed.");
      console.error(`URI: ${uri}`);
      console.error(`Reason: ${error.message}`);
    }
  }

  console.warn("Starting backend with in-memory storage because MongoDB is unavailable.");
  return null;
};

const isDatabaseConnected = () => databaseConnected;

const getDatabaseMode = () => databaseMode;

module.exports = {
  connectDB,
  isDatabaseConnected,
  getDatabaseMode,
};
