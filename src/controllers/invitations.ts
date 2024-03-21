import { Request, Response } from 'express';
import { sendError, sendSuccess } from '../utils/sendResponse';
import { Invitation } from '../entities/invitations';
import { InvitationService } from '../services/invitationService';
import { injectable } from 'tsyringe';
import { getAuthUserId } from '../utils/common';
import { InvitationStatus } from '../types/invitationStatus';
import { FilterDto } from '../types/filterDto';

@injectable()
export class InvitationController {

  constructor(private readonly invitationService: InvitationService) {}

  async createInvitation(req: Request, res: Response): Promise<void> {
    const createInvitation = req.body;
    await this.invitationService.createInvitation(createInvitation,getAuthUserId(req))
    .then((results: Invitation[]) => {
      sendSuccess(req, res, results);
    })
    .catch((error) => {
      sendError(req, res, error);
    });
  }

  async updateInvitation(req: Request, res: Response): Promise<void> {
    const updateInvitationDto = req.body;
    const invitationId: number = parseInt(req.params.invitationId);
    await this.invitationService.updateInvitation(invitationId,updateInvitationDto,getAuthUserId(req)).then((results: Invitation[]) => {
      sendSuccess(req, res, results);
    })
    .catch((error) => {
      sendError(req, res, error);
    });
  }


async getInvitations(req: Request, res: Response): Promise<void> {
  await this.invitationService.getInvitations(req.query as FilterDto,getAuthUserId(req)).then((results: Invitation[] | null) => {
   sendSuccess(req, res, results);
 })
 .catch((error) => {
   sendError(req, res, error);
 });
}
  async getInvitationById(req: Request, res: Response): Promise<void> {
    const invitationId: number = parseInt(req.params.invitationId);
    await this.invitationService.getInvitationById(invitationId,getAuthUserId(req)).then((result: Invitation | null) => {
      sendSuccess(req, res, result);
    })
    .catch((error) => {
      sendError(req, res, error);
    });
  }

  async respondToInvitation(req: Request, res: Response): Promise<void> {
    const invitationId: number = parseInt(req.params.invitationId);
    const status = req.body.status as InvitationStatus;
    await this.invitationService.respondToInvitation(invitationId,status,getAuthUserId(req)).then((result: Invitation | null) => {
      sendSuccess(req, res, result);
    })
    .catch((error) => {
      sendError(req, res, error);
    });
  }

  async checkIn(req: Request, res: Response): Promise<void> {
    const invitationId: number = parseInt(req.params.invitationId);
    await this.invitationService.checkIn(invitationId,getAuthUserId(req)).then((result: Invitation | null) => {
      sendSuccess(req, res, result);
    })
    .catch((error) => {
      sendError(req, res, error);
    });
  }

  async remind(req: Request, res: Response): Promise<void> {
    const invitationId: number = parseInt(req.params.invitationId);
    await this.invitationService.remind(invitationId).then(() => {
      sendSuccess(req, res);
    })
    .catch((error) => {
      sendError(req, res, error);
    });
  }

  

  
  
}
