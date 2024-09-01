import express from "express";

import adminRoutes from "./routes/adminRoutes.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT;

//middleware
app.use(express.json());
app.use("/", adminRoutes);

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
