import { z } from 'zod';
export interface RSVPQuestion {
  title: string;
}
export interface RSVPResponseOptions {
  [key: string]: boolean;
}
export interface RSVPResponse {
  options: RSVPResponseOptions;
}
export interface CreateInvitationDto {
  rsvp: RSVPQuestion;
  rsvpResponse: RSVPResponse;
  userIds: number[];
  eventId: number;
}

const RSVPQuestionSchema = z.object({
  title: z.string(),
});

const RSVPResponseOptionsSchema = z.record(z.boolean());

const RSVPResponseSchema = z.object({
  options: RSVPResponseOptionsSchema,
});

export const CreateInvitationDtoSchema = z.object({
  rsvp: RSVPQuestionSchema,
  rsvpResponse: RSVPResponseSchema,
  userIds: z.array(z.number()),
  eventId: z.number(),
});

export const UpdateInvitationDtoSchema = z.object({
  rsvp: RSVPQuestionSchema.optional(),
  rsvpResponse: RSVPResponseSchema.optional(),
  userIds: z.array(z.number()),
  eventId: z.number(),
});
