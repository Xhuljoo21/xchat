import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "node:path";
import { fileURLToPath } from "url";
import { LlamaModel, LlamaContext, LlamaChatSession } from "node-llama-cpp";
import cors from "cors";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const modelPath = path.join(__dirname, "models", "notus-7b-v1.Q4_K_M.gguf");

const model = new LlamaModel({
  modelPath,
});

const context = new LlamaContext({ model });
const session = new LlamaChatSession({ context });

const app = express();
const server = createServer(app);

app.use(
  cors({
    origin: "*", // Adjust this to specific origins in production
  })
);

const io = new Server(server, {
  cors: {
    origin: "*", // Adjust this to specific origins in production
  },
});

io.on("connection", (soc) => {
  console.log("A new connection established");

  soc.on("message", async (msg) => {
    try {
      const bot_reply = await session.prompt(msg);
      soc.emit("response", bot_reply);
    } catch (error) {
      console.error("Error handling message:", error);
      soc.emit("response", "An error occurred while processing your message.");
    }
  });
});

const PORT = process.env.PORT || 8080;

app.get("/test", (_, res) => {
  res.send("This is just a test");
});

server.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
