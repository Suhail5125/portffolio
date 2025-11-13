import { type Express, type Request, type Response, type NextFunction } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import session from "express-session";
import MemoryStore from "memorystore";
import { storage } from "../storage";
import { config } from "../config";

const SessionStore = MemoryStore(session);

// Configure passport
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Middleware to check if user is authenticated
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
}

// Setup authentication middleware
export function setupAuth(app: Express) {
  // Session configuration using centralized config
  // Config validation ensures SESSION_SECRET is present and secure
  app.use(
    session({
      secret: config.session.secret,
      resave: false,
      saveUninitialized: false,
      store: new SessionStore({
        checkPeriod: config.session.checkPeriod,
      }),
      cookie: {
        maxAge: config.session.maxAge,
        httpOnly: true,
        secure: config.server.isProduction,
        sameSite: config.server.isProduction ? "strict" : "lax",
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
}
