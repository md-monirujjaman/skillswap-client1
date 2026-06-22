import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import apiRoutes from "./src/server/api.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  // Wait for MongoDB to connect
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("Connected to MongoDB successfully");
      
      // Seed Admin User if not exists
      const { User } = await import("./src/server/models.js");
      const adminExists = await User.findOne({ email: "admin1@taskhive.com" });
      if (!adminExists) {
        const bcrypt = await import("bcryptjs");
        const hashedPass = await bcrypt.default.hash("admin1@taskhive.com", 10);
        await User.create({
          name: "Admin",
          email: "admin1@taskhive.com",
          password: hashedPass,
          role: "Admin"
        });
        console.log("Admin seeded.");
      }
    } catch (err) {
      console.error("MongoDB connection error:", err);
    }
  } else {
    console.warn("MONGODB_URI is not set. Please add it to your environment secrets.");
  }

  // Bind API Routes
  app.use("/api", apiRoutes);

  // Vite middleware for development (Serves frontend SPA)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
