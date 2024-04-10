import express from "express";
import session from "express-session";
import "dotenv/config";
import { mongoose } from "mongoose";
import Hello from "./Hello.js";
import Lab5 from "./Lab5.js";
import cors from "cors";
import CourseRoutes from "./Kanbas/courses/routes.js";
import ModuleRoutes from "./Kanbas/modules/routes.js";
import UserRoutes from "./Kanbas/Users/routes.js";

const CONNECTION_STRING = process.env.DB_CONNECTION_STRING || "mongodb://localhost:27017/kanbas"
mongoose.connect(CONNECTION_STRING);

const FRONTEND_BASE = process.env.FRONTEND_URL;

// code credit goes to Piazza post @1134
const VALID_BRANCHES = ["main", "a5", "a6"]
const allowedOrigins = [FRONTEND_BASE, ...VALID_BRANCHES.map((branch) => `https://${branch}--${FRONTEND_BASE.replace("https://", "")}`)]

const handle_origin = (requestOrigin, callback) => {
  if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
    return callback(null, true);
  } else {
    //const msg = `The CORS policy for this site does not allow access from the specified Origin: ${requestOrigin}`;
    const msg = `${allowedOrigins}, req: ${requestOrigin}`;
    return callback(new Error(msg), false);
  }
}

const HTTP_SERVER_DOMAIN_BASE = process.env.HTTP_SERVER_DOMAIN;

const app = express();
app.use(
  cors({
    credentials: true,
    origin: handle_origin,
  })
);
const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
};
if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
  };
}

app.use(session(sessionOptions));
app.use(express.json());
CourseRoutes(app);
ModuleRoutes(app);
UserRoutes(app);
Lab5(app);
Hello(app);
app.listen(process.env.PORT || 4000);
