import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import properties from '../properties';
import { AuthenticatedUser } from '../types/AuthenticatedUser';
import logger from '../logger';
import constants from '../utils/constants';

const SECRET_KEY = properties.secretKey;

export function authenticateToken(req: Request, res: Response, next: NextFunction) {

  try {
    const token = req.headers['authorization'];
    if (typeof token === 'string') {
      const tokenString = token.split(' ')[1]; 
      const user = jwt.verify(tokenString, SECRET_KEY);
      req.user = user; 
      next();
    } else {
      return res.status(constants.UNAUTHORIZED).json({
        success: false,
        error: {
          error: true,
          message: constants.ERROR_MESSAGES[constants.UNAUTHORIZED],
          path: req.baseUrl,
        },
      })
    } 
  } catch (err) {
    logger.error(`Error occured in authenticateToken : ${err}`);
    return res.status(constants.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        error: true,
        message: constants.ERROR_MESSAGES[constants.INTERNAL_SERVER_ERROR],
        path: req.baseUrl,
      },
    })
  }
}

export function checkAuthorization(req: Request, res: Response, next: NextFunction) {
  const tokenUserId = Number((req.user as AuthenticatedUser).user_id);
  const requestedUserId = Number(req.params.id); 
  if (tokenUserId !== requestedUserId) {
    return res.status(constants.FORBIDDEN).json({
      success: false,
      error: {
        error: true,
        message: constants.ERROR_MESSAGES[constants.FORBIDDEN],
        path: req.baseUrl,
      },
    })
  }
  next();
}

