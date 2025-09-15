import dotenv from "dotenv";
dotenv.config();


import express from "express";
import mongoose from "mongoose";

import cors from "cors";
import InvoiceRoutes from "./routes/InvoiceRoutes.js"
import authRoutes from "./routes/authRoutes.js";
import userRoutes from './routes/userRoutes.js';
import reportRoutes from './routes/reportRoutes.js'; 
import clientRoutes from './routes/clientRoutes.js';



const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/invoices", InvoiceRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/clients', clientRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("API is working");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));


  