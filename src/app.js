import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dayjs from "dayjs";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(
    `${dayjs().format("YYYY-MM-DD HH:mm:ss")} [Listening ON] Port: ${PORT}`
  );
});
