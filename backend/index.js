import express from "express";
import cors from "cors";
import session from "express-session";
import UserRoute from "./routes/UserRoute.js";
import EventRoute from "./routes/EventRoute.js";
import db from "./config/Database.js";
import User from "./models/UserModel.js";

const app = express();

// Updated CORS configuration to allow specific origins
const corsOptions = {
  origin: function(origin, callback) {
    // Allow requests from these specific origins
    const allowedOrigins = [
      'http://localhost:8080',
      'http://localhost',
      'http://34.46.200.21:8080',
      'http://34.46.200.21',
      // Add any other origins you need to support
    ];
    
    // For development, you can also allow all origins
    // callback(null, true);
    
    // Or use the following for production
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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
