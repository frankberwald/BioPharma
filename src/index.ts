require("dotenv").config();

import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";

import cors from "cors";

import userRouter from "./routes/user.routes";
import productsRouter from "./routes/products.routes";
import movementsRouter from "./routes/movements.routes";

import { handleError } from "./middlewares/handleError";

import authRouter from "./routes/auth.routes";
import logger from "./config/winston";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/users", userRouter);
app.use("/login", authRouter);
app.use("/products", productsRouter);
app.use("/movements", movementsRouter);

app.get("/env", (req, res) => {
  res.json({
    port: process.env.PORT,
    node_env: process.env.NODE_ENV,
  });
});

app.use(handleError);

AppDataSource.initialize()
  .then(() => {
    logger.info("✅ Banco de dados inicializado com sucesso!");

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      logger.info(`🚀 Servidor rodando em: http://localhost:${port}`);
    });
  })
  .catch((error) => logger.error("❌ Erro ao iniciar o banco de dados:", error));
