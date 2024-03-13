import { z } from "zod";

export interface CreateFeedbackDto {
    comment: string;
    eventId: number;
}

export const CreateFeedbackDtoSchema = z.object({
    comment: z.string(),
    eventId: z.number(),
  });