
import express, { Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { GoogleUser } from '../types/googleUser';
import { UserService } from '../services/userService';
import properties from '../properties';
import { sendError, sendSuccess } from '../utils/sendResponse';
import logger from '../logger';
import { ErrorResponse, throwError } from '../utils/ErrorResponse';

const router = express.Router();

router.get('/login',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/error' }),
  async (req, res) => {
    if (!req.user) {
      throwError({
        errorCategory: 'UNAUTHORIZED',
        message: 'User not authenticated'
      })
      return;
    }
    const userService = new UserService();
    const user: GoogleUser = req.user as GoogleUser; 
    const email =  user._json.email;
    let userResult = await userService.findByEmail(email);
    if(!userResult){
      userResult = await userService.createUser({
        firstName: user._json.given_name,
        lastName: user._json.family_name,
        email: user._json.email,
        imageUrl: user._json.picture,
      });
    }

    const token = jwt.sign({ user_id: userResult.id, email: userResult.email, }, properties.secretKey, { expiresIn: properties.jwtExpiry });
    
    sendSuccess(req, res, {userId: userResult.id, email: userResult.email, token: token });
  });

  router.get('/logout', (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
          logger.error(`Error destroying session: ${err}`);
          sendError(req, res, new ErrorResponse(500, 'Error destroying session'));
      }
      res.redirect('/');
  });
  });
  
export default router;
