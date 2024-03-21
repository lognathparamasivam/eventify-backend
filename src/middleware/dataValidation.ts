import { Request, Response, NextFunction } from 'express';
import { CreateInvitationDtoSchema, UpdateInvitationDtoSchema } from '../types/invitationDto';
import { z } from 'zod';
import constants from '../utils/constants';
import { createEventSchema, updateEventSchema } from '../types/eventDto';
import { CreateFeedbackDtoSchema } from '../types/feedbackDto';

export function validateInvitationData(req: Request, res: Response, next: NextFunction) {
    try {
      CreateInvitationDtoSchema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(constants.BAD_REQUEST).json({
            success: false,
            error: {
              error: true,
              message: error.errors,
              path: req.baseUrl,
            },
          })
      }
    }
  }

  export function validateUpdateInvitationData(req: Request, res: Response, next: NextFunction) {
    try {
      UpdateInvitationDtoSchema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(constants.BAD_REQUEST).json({
            success: false,
            error: {
              error: true,
              message: error.errors,
              path: req.baseUrl,
            },
          })
      }
    }
  }

  export function validateEventData(req: Request, res: Response, next: NextFunction) {
    try {
      createEventSchema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(constants.BAD_REQUEST).json({
            success: false,
            error: {
              error: true,
              message: error.errors,
              path: req.baseUrl,
            },
          })
      }
    }
  }

  export function validateEventUpdateData(req: Request, res: Response, next: NextFunction) {
    try {
      updateEventSchema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(constants.BAD_REQUEST).json({
            success: false,
            error: {
              error: true,
              message: error.errors,
              path: req.baseUrl,
            },
          })
      }
    }
  }

  export function validateCreateFeedbackData(req: Request, res: Response, next: NextFunction) {
    try {
      CreateFeedbackDtoSchema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(constants.BAD_REQUEST).json({
            success: false,
            error: {
              error: true,
              message: error.errors,
              path: req.baseUrl,
            },
          })
      }
    }
  }

  export function validateUpdateNotificationData(req: Request, res: Response, next: NextFunction) {
    try {
      z.object({
        read: z.number()
      }).parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(constants.BAD_REQUEST).json({
            success: false,
            error: {
              error: true,
              message: error.errors,
              path: req.baseUrl,
            },
          })
      }
    }
  }