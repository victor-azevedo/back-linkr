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
<<<<<<< HEAD
=======
app.use(linkrRoutes);
>>>>>>> a4985d5ddd11f8829b9b26102a4ea7c2fc3d546b

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(
    `${dayjs().format("YYYY-MM-DD HH:mm:ss")} [Listening ON] Port: ${PORT}`
  );
});
