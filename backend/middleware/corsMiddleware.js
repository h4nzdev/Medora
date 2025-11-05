// middleware/corsMiddleware.js
import cors from "cors";

const allowedOrigins = [
  "https://medora-dun.vercel.app",
  "https://klinikahub.vercel.app",
  "http://localhost:5173",
];

export const corsConfig = cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
});
