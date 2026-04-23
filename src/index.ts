import express from "express";
import { createServer } from "http";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

const server = createServer(app);

server.listen(process.env.PORT, () => {
  console.log("server is running on port 8888...");
});
