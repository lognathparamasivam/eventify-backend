import { injectable } from 'tsyringe';
import { Invitation } from '../entities/invitations';
import { CreateInvitationDto } from '../types/invitationDto';
import { throwError } from '../utils/ErrorResponse';
import { EventService } from './eventService';
import { UserService } from './userService';
import { invitationRepository } from '../respositories/invitationRepository';
import { MailService } from './emailService';
import { Event } from '../entities/events';
import { InvitationStatus } from '../types/invitationStatus';
import { FilterDto } from '../types/filterDto';
import { applyFilters, isFilterParamsValid } from '../utils/common';
import constants from '../utils/constants';

@injectable()
export class InvitationService {

  constructor(private readonly userService: UserService,private readonly eventService: EventService,
    private readonly mailService:MailService) {}


  async createInvitation(createInvitationDto: CreateInvitationDto,userId: number): Promise<Invitation[]> {
    const event = await this.eventService.getEventById(createInvitationDto.eventId,userId);
    if (!event) {
      throwError({
        errorCategory: 'RESOURCE_NOT_FOUND',
        message: 'Event not found'
      })
    }
    const userIdSet = new Set(createInvitationDto.userIds);
    
    const invitations: Invitation[] = [];
    const usersEmail: string[] = [];
    for (const userId of userIdSet) {
      const user = await this.userService.getUserById(userId);
      if(!user){
        throwError({
          errorCategory: 'RESOURCE_NOT_FOUND',
          message: 'User not found'
        })
      }
      const invitation = invitationRepository.create({
        eventId: createInvitationDto.eventId,
        rsvp: createInvitationDto.rsvp,
        rsvpResponse: createInvitationDto.rsvpResponse,
        userId: userId,
      });
      invitations.push(invitation);
      usersEmail.push(user!.email);
    }
    const invites = await invitationRepository.save(invitations);
    for (const email of usersEmail) {
      this.sendInvitation(event!,email,invitations[0])
    }
    return invites;
  }

  async updateInvitation(invitationId:number, updateInvitationDto: CreateInvitationDto, userId: number): Promise<Invitation[]> {
    try {

      const invitation = await invitationRepository.findOneBy({
        id: invitationId,
      });

      if (!invitation) {
        throwError({
          errorCategory: 'RESOURCE_NOT_FOUND',
          message: 'Invitation not found'
        })
      }
      const event = await this.eventService.getEventById(updateInvitationDto.eventId,userId);
    if (!event) {
      throwError({
        errorCategory: 'RESOURCE_NOT_FOUND',
        message: 'Event not found'
      })
    }
      const invitations: Invitation[] = await invitationRepository.findBy({ eventId: updateInvitationDto.eventId })
      const existingUserIds: Set<number> = new Set(invitations.map(invitation => invitation.userId));

    const userIdsToAdd: number[] = updateInvitationDto.userIds.filter(userId => !existingUserIds.has(userId));
    const userIdsToRemove: number[] = Array.from(existingUserIds).filter(userId => !updateInvitationDto.userIds.includes(userId));

    for (const userId of userIdsToAdd) {
      const newInvitation = new Invitation();
      newInvitation.eventId = updateInvitationDto.eventId;
      newInvitation.userId = userId;
      newInvitation.rsvp = updateInvitationDto.rsvp;
      newInvitation.rsvpResponse = updateInvitationDto.rsvpResponse;
      await invitationRepository.save(newInvitation);
    }
    
    for (const invitation of invitations) {
      if (updateInvitationDto.userIds.includes(invitation.userId)) {
        invitation.rsvp = updateInvitationDto.rsvp;
        invitation.rsvpResponse = updateInvitationDto.rsvpResponse;
        await invitationRepository.save(invitation);
      }
    }

    for (const userId of userIdsToRemove) {
      const invitationToRemove = invitations.find(invitation => invitation.userId === userId);
      if (invitationToRemove) {
        await invitationRepository.delete(invitationToRemove.id);
      }
    }
    
     return await invitationRepository.findBy({ eventId: updateInvitationDto.eventId });
    } catch (err) {
      console.log(err);
      return []
    }
  }

  async deleteInvitation(invitationId: number): Promise<void> {
    const invitation = await invitationRepository.findOneBy({id: invitationId})
    if (!invitation) {
      throwError({
        errorCategory: 'RESOURCE_NOT_FOUND',
        message: 'Invitation not found'
      })
    }
    await invitationRepository.delete({id: invitationId});
  }

  async getInvitations(filter: FilterDto, userId: number): Promise<Invitation[]> {
    if (!isFilterParamsValid(filter, constants.INVITATION_VALID_PARAMS)) {
      throwError({
        errorCategory: constants.ERROR_MESSAGES[constants.BAD_REQUEST],
        message: `Invalid Filter Parameter(s)`,
      })
    }

    const options = applyFilters(filter);
    options.where = [
      { ...options.where, userId: userId },
      { ...options.where, event: { userId: userId} }];
      
      return await invitationRepository.find(options);
  }

  async getInvitationById(invitationId: number,userId: number): Promise<Invitation | null> {
    const invitation = await invitationRepository.findOne({
      where: [
        { id: invitationId, userId: userId },
        { id: invitationId, event: { userId: userId} },
      ]
    });
    if (!invitation) {
      throwError({
        errorCategory: 'RESOURCE_NOT_FOUND',
        message: 'Invitation not found'
      })
    }
    return invitation;
  }

  async respondToInvitation(invitationId: number,status: InvitationStatus, userId: number): Promise<Invitation | null> {
    const invitation = await invitationRepository.findOne({
      where: {
        id: invitationId,
        userId: userId
      }
    });
    if (!invitation) {
      throwError({
        errorCategory: 'RESOURCE_NOT_FOUND',
        message: 'Invitation not found'
      })
    }
    invitation!.status = status;
    return await invitationRepository.save(invitation!);
  }

  async checkIn(invitationId: number, userId: number): Promise<Invitation | null> {
    console.log('invitationId '+invitationId)
    console.log('userId '+userId)

    const invitation = await invitationRepository.findOne({
      where: {
        id: invitationId,
        userId: userId
      }
    });
    if (!invitation) {
      throwError({
        errorCategory: 'RESOURCE_NOT_FOUND',
        message: 'Invitation not found'
      })
    }
    console.log('invitation '+JSON.stringify(invitation))
    if(invitation?.checkin == 1){
      throwError({
        errorCategory: 'BAD_REQUEST',
        message: 'Already Checked In'
      })
    }
    invitation!.checkin = 1;
    invitation!.checkinTime = new Date();
    return await invitationRepository.save(invitation!);
  }

  async sendInvitation(event: Event, userEmail:string, invitation: Invitation): Promise<void> {
    try{
      
      const rsvpButtons = Object.entries(invitation.rsvpResponse.options)
      .map(([key, value]) => `<button onclick="handleRSVP('${key}')">${value}</button>`)
      .join('<br>');
  
      const subject = `Invitation to ${event.title}`;
      const htmlContent = `
        <p>Hello,</p>
        <p>You are invited to attend ${event.title}! at ${event.startDate}</p>
        <p>${invitation.rsvp.title}</p>
        ${rsvpButtons}
      `;
  
      await this.mailService.sendMail(userEmail, subject, htmlContent);
    }
    catch(err){
      console.log(err);
    }
  }

  async checkUserCheckin(userId: number, eventId: number): Promise<boolean> {
    const event = await this.eventService.getEventById(eventId, userId);
    if (!event) {
      throwError({
        errorCategory: 'RESOURCE_NOT_FOUND',
        message: 'Event not found'
      })
    }
    const invitation = await invitationRepository.findOne({
      where: {
        userId: userId,
        eventId: eventId
      }
    });
    return invitation && invitation.checkin === 1 ? true : false;
  }

  async remind(invitationId: number): Promise<void> {
    const invitation = await invitationRepository.findOne({
      where: {
        id: invitationId,
      },
      relations: ['event']
    });
    console.log(JSON.stringify(invitation))
    if (!invitation) {
      throwError({
        errorCategory: 'RESOURCE_NOT_FOUND',
        message: 'Invitation not found'
      })
    }
  }

}
