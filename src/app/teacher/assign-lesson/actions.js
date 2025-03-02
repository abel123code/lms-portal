"use server";

import { z } from "zod";
import connectToDB from "@/lib/mongodb";
import Lesson from "@/lib/modal/Lesson";

// 1. Zod schema for quiz questions
const quizQuestionSchema = z.object({
  question: z.string().min(1, "Question required"),
  options: z.array(z.string().min(1)).min(2, "At least 2 options required"),
  correctAnswer: z.string().min(1, "Correct answer required"),
});

// 2. Zod schema for the entire form (no S3 upload logic)
const formDataSchema = z.object({
  teacherId: z.string().min(1, "Teacher is required"),
  studentId: z.string().min(1, "Student is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  videoFile: z.any().optional(), // We'll ignore this for now
  videoUrl: z.string().optional(),
  quiz: z.array(quizQuestionSchema).optional(),
});

/**
 * Server action to create a Lesson document using YouTube/external link.
 *
 * Ignores `videoFile`.
 * Stores `videoUrl` if provided, else requires a fallback if you enforce it.
 * `completed` is default false in your Lesson schema (you can confirm that).
 */
export async function assignLessonAction(formData) {
  "use server";

  // Extract fields from FormData
  const teacherId = formData.get("teacherId")?.toString() || "";
  const studentId = formData.get("studentId")?.toString() || "";
  const title = formData.get("title")?.toString() || "";
  const description = formData.get("description")?.toString() || "";
  const videoUrl = formData.get("videoUrl")?.toString() || "";
  const quizStr = formData.get("quiz")?.toString() || "[]";

  // We won't handle `videoFile` for now
  // const videoFile = formData.get("videoFile"); <-- ignored

  // Convert quiz JSON string to object
  let quizParsed = [];
  try {
    quizParsed = JSON.parse(quizStr);
  } catch (error) {
    console.error("Error parsing quiz JSON:", error);
  }

  // Validate with Zod
  const validation = formDataSchema.safeParse({
    teacherId,
    studentId,
    title,
    description,
    videoUrl,
    quiz: quizParsed,
  });

  if (!validation.success) {
    console.error("Validation failed:", validation.error.format());
    throw new Error("Form validation failed");
  }

  const { data } = validation;

  // Connect to MongoDB
  await connectToDB();

  // Create a new Lesson in DB
  // We'll assume your Lesson schema has fields:
  //  - teacher (ObjectId)
  //  - student (ObjectId)
  //  - completed: false by default
  //  - storageType: default to 'external' if you want
  const newLesson = await Lesson.create({
    title: data.title,
    description: data.description || "",
    videoUrl: data.videoUrl || "",
    storageType: "external", // or if your schema requires a fallback
    teacher: data.teacherId,  // must match the type in your schema
    student: data.studentId,
    quiz: data.quiz || [],
    // completed defaults to false
  });

  // Return the new lesson ID (or anything you'd like to the client)
  return newLesson._id.toString();
}
