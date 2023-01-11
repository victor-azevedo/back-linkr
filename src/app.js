import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dayjs from "dayjs";

import linkrRoutes from "./routes/links.routes.js";
import userRouter from "./routes/user.routes.js";
import routesAuth from "./routes/auth.routes.js";
import hashtagRoutes from "./routes/hashtag.routes.js";
import commentsRouter from "./routes/comments.routes.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use(routesAuth);
app.use(userRouter);
app.use(linkrRoutes);
app.use(hashtagRoutes);
app.use(commentsRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(
    `${dayjs().format("YYYY-MM-DD HH:mm:ss")} [Listening ON] Port: ${PORT}`
  );
});
