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
import { applyFilters, isFilterParamsValid, lookupResponseByInvitationStatus } from '../utils/common';
import constants from '../utils/constants';
import { NotificationService } from './notificationService';
import { getCalendarEvent, updateCalendarEvent } from './calendarService';
import { eventRepository } from '../respositories/eventRepository';
import { userRepository } from '../respositories/userRepository';
import logger from '../logger';

@injectable()
export class InvitationService {

  constructor(private readonly userService: UserService, private readonly eventService: EventService,
    private readonly mailService: MailService, private readonly notificationService: NotificationService) { }


  async createInvitation(createInvitationDto: CreateInvitationDto, userId: number): Promise<Invitation[]> {
    const event = await this.eventService.getEventById(createInvitationDto.eventId, userId);
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
      if (!user) {
        throwError({
          errorCategory: 'RESOURCE_NOT_FOUND',
          message: 'User not found'
        })
      }
      const existingInvitation = await invitationRepository.findOne({
        where: { eventId: createInvitationDto.eventId, userId: userId }
      });
      if (existingInvitation) {
        throwError({
          errorCategory: 'BAD_REQUEST',
          message: 'User already Invited'
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
    const createdInvites = await invitationRepository.save(invitations);
    if (event) {
      for (const invite of createdInvites) {
        await this.notificationService.createNotification({
          message: `You have been Invited for Event ${event.title} on ${event.startDate}`,
          userId: invite!.userId,
          read: 0
        });
      }
      for (const email of usersEmail) {
        this.sendInvitation(event, email)
      }
      const calendarEventData = await getCalendarEvent(event!.userId, event!.calendarId)
      if (calendarEventData) {
        const updatedAttendees = calendarEventData.attendees ? [...calendarEventData.attendees] : [];
        for (const email of usersEmail) {
          if (!updatedAttendees.some(attendee => attendee.email === email)) {
            updatedAttendees.push({
              email: email,
              responseStatus: 'needsAction',
            });
          }
        }
        calendarEventData.attendees = updatedAttendees;
        await updateCalendarEvent(event!.userId, event!.calendarId, calendarEventData);
      }
      await eventRepository.save(event);
    }
    return createdInvites;
  }

  async updateInvitation(updateInvitationDto: CreateInvitationDto, userId: number): Promise<Invitation[]> {
    const event = await this.eventService.getEventById(updateInvitationDto.eventId, userId);
    if (!event) {
      throwError({
        errorCategory: 'RESOURCE_NOT_FOUND',
        message: 'Event not found'
      })
    }
    const invitations: Invitation[] = await invitationRepository.findBy({ eventId: updateInvitationDto.eventId })

    if (updateInvitationDto.userIds) {
      const existingUserIds: Set<number> = new Set(invitations.map(invitation => invitation.userId));
      const userIdsToAdd: number[] = updateInvitationDto.userIds.filter(userId => !existingUserIds.has(userId));
      const userIdsToRemove: number[] = Array.from(existingUserIds).filter(userId => !updateInvitationDto.userIds.includes(userId));

      const addUserEmail: string[] = [];
      const removeUserEmail: string[] = [];
      const newInvitations: Invitation[] = [];

      for (const userIdAdd of userIdsToAdd) {
        const userAdd = await this.userService.getUserById(userIdAdd);
        if (!userAdd) {
          throwError({
            errorCategory: 'RESOURCE_NOT_FOUND',
            message: 'User not found'
          })
        }
        const invitation = invitationRepository.create({
          eventId: updateInvitationDto.eventId,
          rsvp: updateInvitationDto.rsvp,
          rsvpResponse: updateInvitationDto.rsvpResponse,
          userId: userIdAdd,
        });
        newInvitations.push(invitation);
        addUserEmail.push(userAdd!.email);
        await this.notificationService.createNotification({
          message: `You have been Invited for Event ${event!.title} on ${event!.startDate}`,
          userId: userIdAdd,
          read: 0
        });
      }
      await invitationRepository.save(newInvitations);

      for (const userIdRemove of userIdsToRemove) {
        const userRemoved = await this.userService.getUserById(userIdRemove);
        const invitationToRemove = invitations.find(invitation => invitation.userId === userIdRemove);
        if (invitationToRemove) {
          await invitationRepository.delete(invitationToRemove.id);
        }
        await this.notificationService.createNotification({
          message: `You have been Removed from Event ${event!.title} on ${event!.startDate}`,
          userId: userIdRemove,
          read: 0
        });
        removeUserEmail.push(userRemoved!.email);
      }

      const calendarEventData = await getCalendarEvent(event!.userId, event!.calendarId)
      if (calendarEventData) {
        if (addUserEmail.length > 0) {
          calendarEventData.attendees!.push(...addUserEmail.map(email => ({ email: email })));
        }
        if (removeUserEmail.length > 0) {
          calendarEventData.attendees = calendarEventData.attendees!.filter(attendee => {
            if (attendee && attendee.email) {
              return !removeUserEmail.includes(attendee.email);
            }
            return true;
          });
        }
        await updateCalendarEvent(event!.userId, event!.calendarId, calendarEventData)
      }
    }
    const updatedInvitations: Invitation[] = await invitationRepository.findBy({ eventId: updateInvitationDto.eventId })

    for (const invitation of updatedInvitations) {
      invitation.rsvp = updateInvitationDto.rsvp;
      invitation.rsvpResponse = updateInvitationDto.rsvpResponse;
      await invitationRepository.save(invitation);
    }

    return updatedInvitations;
  }

  async deleteInvitation(invitationId: number): Promise<void> {
    const invitation = await invitationRepository.findOneBy({ id: invitationId })
    if (!invitation) {
      throwError({
        errorCategory: 'RESOURCE_NOT_FOUND',
        message: 'Invitation not found'
      })
    }
    const event = await eventRepository.findOne({ where: { id: invitation?.eventId } })
    const user = await userRepository.findOne({ where: { id: invitation?.userId } })

    const calendarEventData = await getCalendarEvent(event!.userId, event!.calendarId)
    if (calendarEventData) {
      const attendeeIndex = calendarEventData.attendees!.findIndex(attendee => attendee.email === user!.email);
      if (attendeeIndex !== -1) {
        calendarEventData.attendees!.splice(attendeeIndex, 1);
        await updateCalendarEvent(event!.userId, event!.calendarId, calendarEventData)
      }
    }

    await invitationRepository.delete({ id: invitationId });
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
      { ...options.where, event: { userId: userId } }];

    return await invitationRepository.find(options);
  }

  async getInvitationById(invitationId: number, userId: number): Promise<Invitation | null> {
    const invitation = await invitationRepository.findOne({
      where: [
        { id: invitationId, userId: userId },
        { id: invitationId, event: { userId: userId } },
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

  async respondToInvitation(invitationId: number, status: InvitationStatus, userId: number): Promise<Invitation | null> {
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
    await invitationRepository.save(invitation!);
    const event = await eventRepository.findOne({ where: { id: invitation?.eventId } })
    const user = await userRepository.findOne({ where: { id: invitation?.userId } })

    await this.notificationService.createNotification({
      message: `You have responded to ${event?.title} as ${status} on ${new Date().toISOString()}`,
      userId: invitation!.userId,
      read: 0
    });

    const calendarEventData = await getCalendarEvent(event!.userId, event!.calendarId);
    if (calendarEventData) {
      const attendeeIndex = calendarEventData.attendees!.findIndex(attendee => attendee.email === user?.email);
      if (attendeeIndex !== -1) {
        calendarEventData.attendees![attendeeIndex].responseStatus = lookupResponseByInvitationStatus(invitation!.status)
      }
      await updateCalendarEvent(event!.userId, event!.calendarId, calendarEventData)
    }
    return invitation;
  }

  async checkIn(invitationId: number, userId: number): Promise<Invitation | null> {
    const invitation = await invitationRepository.findOne({
      where: {
        id: invitationId,
        userId: userId
      },
    });

    if (!invitation) {
      throwError({
        errorCategory: 'RESOURCE_NOT_FOUND',
        message: 'Invitation not found'
      })
    }
    if (invitation?.status === InvitationStatus.REJECTED || invitation?.status === InvitationStatus.PENDING) {
      throwError({
        errorCategory: 'BAD_REQUEST',
        message: `User cannot checkin because invitation is ${invitation?.status}`
      });
    }

    if (invitation?.checkin == 1) {
      throwError({
        errorCategory: 'BAD_REQUEST',
        message: 'Already Checked In'
      })
    }

    invitation!.checkin = 1;
    invitation!.checkinTime = new Date();
    await this.notificationService.createNotification({
      message: `Thanks: You have checkedIn on ${new Date().toISOString()}`,
      userId: invitation!.userId,
      read: 0
    });

    return await invitationRepository.save(invitation!);
  }

  async sendInvitation(event: Event, userEmail: string): Promise<void> {
    try {
      const subject = `Invitation to ${event.title}`;
      const htmlContent = `
          <p>Hello,</p>
          <p>You are invited to attend ${event.title} on ${event.startDate?.toISOString()}</p>`;

      await this.mailService.sendMail(userEmail, subject, htmlContent);
    }
    catch (err) {
      logger.error(`Error occured on sendInvitation ${err}`)
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
      relations: ['event','user']
    });
    if (!invitation) {
      throwError({
        errorCategory: 'RESOURCE_NOT_FOUND',
        message: 'Invitation not found'
      })
    }

    await this.sendInvitation(invitation!.event, invitation!.user.email)
    await this.notificationService.createNotification({
      message: `Reminder: You have an Event ${invitation?.event.title} on ${invitation?.event.startDate}`,
      userId: invitation!.userId,
      read: 0
    });
  }

  async sendReminder(event: Event, userEmail: string): Promise<void> {
    try {
      const subject = `Reminder for  ${event.title}`;
      const htmlContent = `
          <p>Hello,</p>
          <p>A Reminder from Organizer</p>
          <p>You have an Event ${event.title} to attend on ${event.startDate?.toISOString()}</p>`;

      await this.mailService.sendMail(userEmail, subject, htmlContent);
    }
    catch (err) {
      logger.error(`Error occured on sendReminder ${err}`)
    }
  }

}
