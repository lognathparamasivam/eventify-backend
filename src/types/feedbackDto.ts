import { z } from "zod";

export interface CreateFeedbackDto {
    comment: string;
    userId: number;
    eventId: number;
}

export const CreateFeedbackDtoSchema = z.object({
    comment: z.string(),
    userId: z.number(),
    eventId: z.number(),
  });