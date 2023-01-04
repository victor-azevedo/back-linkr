import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dayjs from "dayjs";

import linkrRoutes from "./routes/links.routes.js";

dotenv.config();
import routesAuth from "./routes/auth.routes.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use(routesAuth);
app.use(linkrRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(
    `${dayjs().format("YYYY-MM-DD HH:mm:ss")} [Listening ON] Port: ${PORT}`
  );
});
