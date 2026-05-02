import express from "express";
import dotenv from "dotenv";
import routes from "./routes/notificationRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/notifications", routes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});