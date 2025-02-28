require("dotenv").config();

import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";

import cors from "cors";

import userRouter from "./routes/user.routes";
import driverRouter from "./routes/driver.routes";
import branchRouter from "./routes/branch.routes";

import { handleError } from "./middlewares/handleError";

import authRouter from "./routes/auth.routes";
import logger from "./config/winston";
import { verifyToken } from "./middlewares/auth";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/users", userRouter);
app.use("/login", authRouter);
app.use("/drivers", driverRouter);
app.use("/branches", branchRouter);

app.get("/env", (req, res) => {
  res.json({
    port: process.env.PORT,
    node_env: process.env.NODE_ENV,
  });
});

app.use(handleError);

AppDataSource.initialize()
  .then(() => {
    app.listen(process.env.PORT, () => {
      logger.info(
        `O servidor está rodando em http://localhost:${process.env.PORT}`
      );
    });
  })
  .catch((error) => console.log(error));
