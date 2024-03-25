import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import dotenv from "dotenv";

dotenv.config();

export const passportConfig = (passport: passport.Authenticator) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        callbackURL: '/auth/google/callback',
      },
      (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
      }
    )
  );

  passport.use(
    'google-calendar',
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID ?? '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        callbackURL: '/auth/google/calendar/callback',
      },
      (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
      }
    )
  );

  // Serialize and Deserialize User
  passport.serializeUser((user : Express.User, done) => {
    done(null, user);
  });

  passport.deserializeUser((user: Express.User, done) => {
    done(null, user);
  });
};
