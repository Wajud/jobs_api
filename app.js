const express = require("express");
const jobsRouter = require("./routes/jobs");
const authRouter = require("./routes/auth");
const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");
require("express-async-errors");
require("dotenv").config({ path: ".env" });

const app = express();
// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());
// extra packages

app.get("/", (req, res) => {
  res.send("Jobs API is live!!!");
});
// routes

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
