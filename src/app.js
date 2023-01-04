import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dayjs from "dayjs";

dotenv.config();
import routesAuth from "./routes/auth.routes.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use(routesAuth);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(
    `${dayjs().format("YYYY-MM-DD HH:mm:ss")} [Listening ON] Port: ${PORT}`
  );
});
