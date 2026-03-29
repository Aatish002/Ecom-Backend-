import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import authRoutes from "./routes/user.route.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
const port = 5001;
const hostname = "127.0.0.1";

app.get("/", (req, res) => {
  res.send("Server is Running!");
});

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

connectDB()
  .then(() =>
    app.listen(port, hostname, () =>
      console.log(`Server running successfully at http://${hostname}:${port}`),
    ),
  )
  .catch((err) => console.log("Error in connection :", err));
