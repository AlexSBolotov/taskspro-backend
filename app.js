const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");

const swaggerDocument = require("./swagger.json");
const boardsRouter = require("./routes/api/boards.routes");
const columnsRouter = require("./routes/api/columns.routes");
const tasksRouter = require("./routes/api/tasks.routes");
const usersRouter = require("./routes/api/auth.routes");
const helpRouter = require("./routes/api/help.routes");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/boards", boardsRouter);
app.use("/api/columns", columnsRouter);
app.use("/api/tasks", tasksRouter);
app.use("/users", usersRouter);
app.use("/api/help", helpRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});
app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
