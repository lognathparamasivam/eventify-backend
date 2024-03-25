import { container } from "tsyringe";
import { EventService } from "./eventService";
import { InvitationService } from "./invitationService";
import { UserService } from "./userService";
import { lookupEventStatusByResponse, lookupInvitationStatusByResponse } from '../utils/common';
import logger from "../logger";
import { getCalendarEvent } from "./calendarService";

const eventService: EventService = container.resolve(EventService);
const userService: UserService = container.resolve(UserService);
const invitationService: InvitationService = container.resolve(InvitationService);

export async function handleCalendarWebookEvent(calendarEventId: string) {
    try {
        const event = await eventService.getEventByCalendarId(calendarEventId)
        if (event) {
            const calendarEventData = await getCalendarEvent(event.userId, calendarEventId);
            if (calendarEventData) {
                const eventStatus = lookupEventStatusByResponse(calendarEventData.status as string)
                if (eventStatus !== event.status) {
                    await eventService.updateEvent(event.id, { status: eventStatus })
                }
                const attendees = calendarEventData.attendees!
                if (attendees) {
                    for (const attendee of attendees) {
                        const user = await userService.findByEmail(attendee.email as string);
                        const invitations = await invitationService.getInvitations({ eventId: { eq: event.id } }, user!.id)
                        if (invitations.length > 0) {
                            for (const invitation of invitations) {
                                const invitationStatus = lookupInvitationStatusByResponse(attendee.responseStatus as string)
                                if (invitationStatus !== invitation.status) {
                                    invitation.status = invitationStatus;
                                    await invitationService.respondToInvitation(invitation.id, invitation.status, user!.id)
                                }
                            }
                        }
                    }
                }

            }
        }
    } catch (err) {
        logger.error(`Error occured in handleCalendarWebookEvent ${err}`)
    }

}