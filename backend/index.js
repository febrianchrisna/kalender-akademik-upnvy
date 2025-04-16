import express from "express";
import cors from "cors";
import session from "express-session";
import UserRoute from "./routes/UserRoute.js";
import EventRoute from "./routes/EventRoute.js";
import db from "./config/Database.js";
import User from "./models/UserModel.js";

const app = express();

// Add CORS configuration
const corsOptions = {
  origin: "http://34.46.200.21:8080", // Gantilah dengan alamat IP eksternal VM Anda
  credentials: true,                   // Allow cookies and credentials
  methods: ["GET", "POST", "PUT", "DELETE"],  // Metode HTTP yang diizinkan
  allowedHeaders: ["Content-Type", "Authorization"], // Header yang diizinkan
};
app.use(cors(corsOptions));

// Initialize the database connection
(async () => {
  try {
    await db.authenticate();
    console.log("Database connected");
    // Sync all models with database
    await db.sync();
    console.log("All models synchronized");
  } catch (error) {
    console.error("Database connection error:", error);
  }
})();

// Create admin user
(async () => {
  try {
    await User.createAdminUser();
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
})();

app.use(express.json());

// Session middleware for simple authentication
app.use(session({
  secret: 'utsupn2025',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true in production with HTTPS
    httpOnly: true, // Prevent client-side access to the cookie
    sameSite: "lax", // Prevent CSRF attacks
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Add routes with /api prefix
app.use("/api", UserRoute);
app.use("/api", EventRoute);

app.listen(5000, () => console.log("Server connected on port 5000"));
