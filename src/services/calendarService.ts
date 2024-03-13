import { calendar_v3, google } from 'googleapis';
import { Event } from '../entities/events';
import oAuth2Client from '../config/authConfig';
import { TokenService } from './tokenService';
import { container } from 'tsyringe';
import crypto from 'crypto';
import logger from '../logger';
import { GaxiosError } from 'gaxios';

const tokenService: TokenService = container.resolve(TokenService);


export async function exchangeCodeForToken(code: string): Promise<{ accessToken: string; refreshToken: string }> {
    const { tokens } = await oAuth2Client.getToken(code);
    return { accessToken: tokens.access_token ?? '', refreshToken: tokens.refresh_token ?? '' };
}

export async function refreshToken(userId: number): Promise<void> {
    try {
        const existingTokens = await tokenService.getToken(userId);
        oAuth2Client.setCredentials({ refresh_token: existingTokens?.refreshToken });
        const tokens = await oAuth2Client.refreshAccessToken();
        if (tokens) {
            await tokenService.deleteToken(userId);
            await tokenService.createToken(userId, tokens.credentials!.access_token!, tokens.credentials!.refresh_token!);
        }

    } catch (err) {
        logger.error(`Error occured in refreshToken ${err}`)
    }

}

export async function getAccessToken(code: string): Promise<string> {
    const { accessToken } = await exchangeCodeForToken(code);
    return accessToken;
}

export async function getCalendar(userId: number): Promise<calendar_v3.Calendar> {
    const tokens = await tokenService.getToken(userId)
    oAuth2Client.setCredentials({ access_token: tokens?.accessToken });
    return google.calendar({ version: 'v3', auth: oAuth2Client });
}

export async function deleteCalendarEvent(userId: number, eventId: string,) {
    try{
        const calendar = await getCalendar(userId);
        await calendar.events.delete({
            calendarId: 'primary',
            eventId: eventId
        });
    }catch(err){
        logger.error(`Error occured in deleteCalendarEvent ${err}`)
    }
    
}

export async function getCalendarEvent(userId: number, eventId: string, retry?: number): Promise<calendar_v3.Schema$Event | null> {
    try {
        const calendar = await getCalendar(userId);
        return (await calendar.events.get({ calendarId: 'primary', eventId: eventId })).data
    } catch (err) {
        if (err instanceof GaxiosError) {
            if (err.code == '401' && (retry ?? 0) < 3) {
                logger.error(`Error occured in getCalendarEvent ${err.code} and retrying ${retry}`)

                await refreshToken(userId)
                await getCalendarEvent(userId, eventId, (retry ?? 0) + 1)
            }
        } else {
            logger.error(`Error occured in getCalendarEvent ${err}`)
        }
        return null;
    }
}

export async function updateCalendarEvent(userId: number, eventId: string, eventData: calendar_v3.Schema$Event): Promise<void> {
    try {
        const calendar = await getCalendar(userId);
        await calendar.events.update({ calendarId: 'primary', eventId: eventId, requestBody: eventData })
    } catch (err) {
        logger.error(`Error occured in updateCalendarEvent ${err}`)
    }

}

export async function createCalendarEvent(userId: number, eventDetail: Event, attendeesMail: string[]): Promise<string> {
    try {
        const calendar = await getCalendar(userId);
        const attendees: { email: string }[] = []
        for (const mail of attendeesMail) {
            attendees.push({ email: mail });
        }
        const event = {
            summary: eventDetail.title,
            location: eventDetail.location,
            description: eventDetail.description,
            start: {
                dateTime: new Date(eventDetail.startDate!).toISOString(),
                timeZone: 'Asia/Kolkata',
            },
            end: {
                dateTime: new Date(eventDetail.endDate!).toISOString(),
                timeZone: 'Asia/Kolkata',
            },
            attendees: attendees.map(attendee => ({
                email: attendee.email,
                responseStatus: 'needsAction',
            })),
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'email', minutes: 10 },
                    { method: 'popup', minutes: 10 },
                ],
            },
        };
        const createdEvent = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: event,
        });
        const calendarEventId = createdEvent.data.id
        await subscribeToWebhook(calendarEventId!, calendar);
        return calendarEventId ?? '';
    } catch (error) {
        logger.error(`Error creating in createCalendarEvent: ${error}`);
        return '';
    }

    async function subscribeToWebhook(calendarEventId: string, calendar: calendar_v3.Calendar) {
        try {
            await calendar.events.watch({
                calendarId: 'primary',
                requestBody: {
                    id: crypto.randomBytes(16).toString("hex"),
                    type: 'web_hook',
                    address: `https://aardvark-notable-terminally.ngrok-free.app/auth/webhook/calendar/?eventId=${calendarEventId}`,
                },
            });
        } catch (error) {
            logger.error(`Error subscribing to webhook: ${error}`);
        }
    }
}
