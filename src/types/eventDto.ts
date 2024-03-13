import { z } from 'zod';
export interface CreateEventDto {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
}

export interface UpdateEventDto {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    location: string;
    media?: EventMediaDto
}

export interface EventMediaDto {
    images?: string[]; 
    videos?: string[]; 
    documents?: string[];
}


export const createEventSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  startDate: z.string(),
  endDate: z.string(), 
}).refine(data => {
  if (data.startDate && data.endDate) {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    return startDate < endDate;
  }
  return false;
},{
  message: 'Start date must be lesser than end date',
});

export const updateEventSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  location: z.string().min(1).optional(),
  media: z.object({
    images: z.array(z.string()).optional(), 
    videos: z.array(z.string()).optional(), 
    documents: z.array(z.string()).optional(),
  }).optional(),
}).refine(data => {
  if (data.startDate && data.endDate) {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    return startDate < endDate;
  }
  return false;
},{
  message: 'Start date must be lesser than end date',
});
