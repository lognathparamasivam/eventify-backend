
import express, { Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { GoogleUser } from '../types/googleUser';
import { UserService } from '../services/userService';
import properties from '../properties';
import { sendError, sendSuccess } from '../utils/sendResponse';
import logger from '../logger';
import { ErrorResponse, throwError } from '../utils/ErrorResponse';
import { exchangeCodeForToken } from '../services/calendarService';
import { TokenService } from '../services/tokenService';
import { container } from 'tsyringe';
import { handleCalendarWebookEvent } from '../services/webhookService';
import { google } from 'googleapis';
import { getAuthUserId } from '../utils/common';

const router = express.Router();
const tokenService: TokenService = container.resolve(TokenService);
const userService: UserService = container.resolve(UserService);


router.get('/login',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/error' }),
  async (req, res) => {
    const oauth2Client = new google.auth.OAuth2({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      redirectUri: `${process.env.BASEURL}/auth/google/calendar/callback`,
    });
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: ['https://www.googleapis.com/auth/calendar']
    });
    res.redirect(authUrl);
  });

//router.get('/google/calendar', passport.authenticate('google-calendar', { scope: ['https://www.googleapis.com/auth/calendar'] }));

router.get('/google/calendar/callback',
  async (req, res) => {
    if (!req.user) {
      throwError({
        errorCategory: 'UNAUTHORIZED',
        message: 'User not authenticated'
      })
      return;
    }
    const user: GoogleUser = req.user as GoogleUser;
    const email = user._json.email;
    let userResult = await userService.findByEmail(email);
    if (!userResult) {
      userResult = await userService.createUser({
        firstName: user._json.given_name,
        lastName: user._json.family_name,
        email: user._json.email,
        imageUrl: user._json.picture,
      });
    }
    const googleTokens = await exchangeCodeForToken(req.query.code as string);
    const existingGoogleToken = await tokenService.getToken(userResult.id)
    if (existingGoogleToken) {
      tokenService.deleteToken(userResult.id)
    }
    tokenService.createToken(userResult.id,googleTokens.accessToken, googleTokens.refreshToken)

    const token = jwt.sign({ user_id: userResult.id, email: userResult.email, }, properties.secretKey, { expiresIn: properties.jwtExpiry });
    sendSuccess(req, res, { userId: userResult.id, email: userResult.email, token: token });
  }
);

router.post('/webhook/calendar',
  async (req, res) => {
    const calendarEventId = req.query.eventId as string;
    const resourceState = req.headers['x-goog-resource-state'];
    if (calendarEventId) {
      handleCalendarWebookEvent(calendarEventId)
    }
    if (resourceState === 'sync') {
      return res.status(200).send();
    }
  }
);

router.get('/logout', (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      logger.error(`Error destroying session: ${err}`);
      sendError(req, res, new ErrorResponse(500, 'Error destroying session'));
    }
    res.redirect('/');
  });
});


router.get('/access-tokens', async (req: Request, res: Response) => {
  res.send(await tokenService.getToken(getAuthUserId(req)))
});

export default router;
