import { z } from 'zod';

export const chatRequestSchema = z.object({
  message: z.string().trim().min(1, 'Message cannot be empty').max(2000),
  documentIds: z.array(z.coerce.number().int()).optional().default([]),
});
