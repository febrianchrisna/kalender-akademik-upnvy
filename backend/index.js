import express from "express";
import cors from "cors";
import session from "express-session";
import UserRoute from "./routes/UserRoute.js";
import EventRoute from "./routes/EventRoute.js";
import db from "./config/Database.js";
import User from "./models/UserModel.js";

const app = express();

// Allow all origins for development (temporary solution)
const corsOptions = {
  origin: true, // Allow all origins temporarily for debugging
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// Apply CORS globally to all routes
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

// Make sure to listen on all interfaces (not just localhost)
app.listen(5000, '0.0.0.0', () => console.log("Server connected on port 5000"));
