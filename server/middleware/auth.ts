import { type Express, type Request, type Response, type NextFunction } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import session from "express-session";
import MemoryStore from "memorystore";
import { storage } from "../storage";
import { config } from "../config";
import { logger } from "../logger";

const SessionStore = MemoryStore(session);

// Configure passport
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      if (!user) {
        logger.warn('Failed login attempt - user not found', { username });
        return done(null, false, { message: "Incorrect username" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        logger.warn('Failed login attempt - invalid password', { username, userId: user.id });
        return done(null, false, { message: "Incorrect password" });
      }

      logger.info('Successful login', { username, userId: user.id });
      return done(null, user);
    } catch (error) {
      logger.error('Login error', { username, error });
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
  // Detect if running on Firebase Cloud Functions
  const isFirebase = process.env.FUNCTION_TARGET !== undefined || process.env.FUNCTIONS_EMULATOR === 'true';
  
  logger.info('Auth setup', { 
    isFirebase, 
    isProduction: config.server.isProduction,
    functionTarget: process.env.FUNCTION_TARGET 
  });
  
  // Session configuration using centralized config
  // Config validation ensures SESSION_SECRET is present and secure
  app.use(
    session({
      name: "__session", // Required for Firebase Hosting to preserve the cookie
      secret: config.session.secret,
      resave: false,
      saveUninitialized: false,
      store: new SessionStore({
        checkPeriod: config.session.checkPeriod,
      }),
      cookie: {
        maxAge: config.session.maxAge,
        httpOnly: true,
        secure: false, // Set to false for now to test - Firebase has issues with secure cookies
        sameSite: "lax", // Use "lax" for better compatibility
        path: '/',
      },
      proxy: true, // Always trust proxy on Firebase and cloud platforms
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
  
  // Middleware to log authentication status for debugging
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/') && req.path !== '/api/auth/debug') {
      logger.info('Request auth status', {
        path: req.path,
        method: req.method,
        isAuthenticated: req.isAuthenticated(),
        hasSession: !!req.session,
        sessionID: req.sessionID,
        cookies: req.headers.cookie ? 'present' : 'missing'
      });
    }
    next();
  });
}
