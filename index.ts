import express = require("express");
import cors = require("cors");

import getInfoRouter from "./src/routes/getInfo";
import newGetInfoRouter from "./src/routes/new-getInfo";

const app = express();
const port = 3000;
app.use(cors());

app.use("/api", getInfoRouter);
app.use("/api", newGetInfoRouter);

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});