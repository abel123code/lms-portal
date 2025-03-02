// lessonSchema.js (for client-side validation)
import { z } from "zod";

export const quizQuestionSchema = z.object({
  question: z.string().min(1, "Question cannot be empty"),
  options: z.array(z.string().min(1, "Option cannot be empty")).min(2),
  correctAnswer: z.string().min(1, "Select the correct answer"),
});

export const lessonZodSchema = z.object({
  _id: z.string(), // The lesson ID
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  videoUrl: z.string().min(1, "Video URL is required"),
  storageType: z.string().optional(),
  teacher: z.string().nullable().optional(),
  student: z.string().nullable().optional(),
  completed: z.boolean().optional(),
  quiz: z.array(quizQuestionSchema).optional(),
});
