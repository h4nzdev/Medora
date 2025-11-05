// middleware/sessionMiddleware.js
import session from "express-session";

export const sessionConfig = session({
  secret: process.env.SESSION_SECRET || "your-fallback-secret-change-this",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  },
});
