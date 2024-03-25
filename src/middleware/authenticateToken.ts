import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import properties from '../properties';
import { AuthenticatedUser } from '../types/authenticatedUser';
import logger from '../logger';
import constants from '../utils/constants';
import { EventService } from '../services/eventService';
import { Event } from '../entities/events';
import { sendError } from '../utils/sendResponse';
import { container } from 'tsyringe';
import { InvitationService } from '../services/invitationService';
import { Invitation } from '../entities/invitations';

const SECRET_KEY = properties.secretKey;
const eventService: EventService = container.resolve(EventService);
const invitationService: InvitationService = container.resolve(InvitationService);

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
    if(err instanceof JsonWebTokenError){
      return res.status(constants.BAD_REQUEST).json({
        success: false,
        error: {
          error: true,
          message: `${err.name}:${err.message}`,
          path: req.baseUrl,
        },
      })
    }
  }
}

export function checkAuthorization(req: Request, res: Response, next: NextFunction) {
  const tokenUserId = Number((req.user as AuthenticatedUser).user_id);
  const requestedUserId = Number(req.params.userId); 
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

export async function checkEventOrganizer(req: Request, res: Response, next: NextFunction) {
  const tokenUserId = Number((req.user as AuthenticatedUser).user_id);
  const eventId = Number(req.body.eventId ?? req.params.eventId); 
  await eventService.getEventById(eventId,tokenUserId).then((result: Event | null) => {
    if (tokenUserId !== result?.userId) {
      return res.status(403).json({
        success: false,
        error: {
          error: true,
          message: "Forbidden",
          path: req.baseUrl,
        },
      })
    }
    next();
  })
  .catch((error) => {
    sendError(req, res, error);
  });
}

export async function checkFeedbackAuthorized(req: Request, res: Response, next: NextFunction) {
  const tokenUserId = Number((req.user as AuthenticatedUser).user_id);
  const eventId = Number(req.body.eventId); 
  await invitationService.checkUserCheckin(tokenUserId,eventId).then((result: boolean) => {
    if (!result) {
      return res.status(403).json({
        success: false,
        error: {
          error: true,
          message: "Forbidden",
          path: req.baseUrl,
        },
      })
    }
    next();
  })
  .catch((error) => {
    sendError(req, res, error);
  });
}


export async function checkRemindAuthorized(req: Request, res: Response, next: NextFunction) {
  const tokenUserId = Number((req.user as AuthenticatedUser).user_id);
  const invitationId = Number(req.params.invitationId); 
  await invitationService.getInvitationById(invitationId,tokenUserId).then((result: Invitation | null) => {
    if (result) {
      if(result.userId === tokenUserId){
        return res.status(403).json({
          success: false,
          error: {
            error: true,
            message: "Forbidden",
            path: req.baseUrl,
          },
        })
      }
    }
    next();
  })
  .catch((error) => {
    sendError(req, res, error);
  });
}

