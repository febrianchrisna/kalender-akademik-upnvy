import express from "express";
import cors from "cors";
import {
  getEvents,
  getEventsByDate,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/EventController.js";

const router = express.Router();

// Updated CORS to allow specific origins
router.use(cors({ 
  origin: function(origin, callback) {
    // Allow requests from these specific origins
    const allowedOrigins = [
      'http://localhost:8080',
      'http://localhost',
      'http://34.46.200.21:8080', 
      'http://34.46.200.21'
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Middleware for logging incoming requests
router.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Auth middleware for checking login status
const checkAuth = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ redirect: "/uts/frontend/sign-in.html", msg: "Please login first" });
  }
  next();
};

// Routes
router.get("/events", getEvents); // Corrected route path
router.get("/events/date/:date", getEventsByDate); // Corrected route path
router.get("/events/:id", getEventById); // Corrected route path
router.post("/events", checkAuth, createEvent);
router.put("/events/:id", checkAuth, updateEvent);
router.delete("/events/:id", checkAuth, deleteEvent);

export default router;
