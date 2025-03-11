"use server";

import { z } from "zod";
import connectToDB from "@/lib/mongodb";
import Lesson from "@/lib/modal/Lesson";
import s3 from "@/lib/s3";

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
  console.log('Assign Lesson page form data:::', formData);

  // Extract fields from FormData
  const teacherId = formData.get("teacherId")?.toString() || "";
  const studentId = formData.get("studentId")?.toString() || "";
  const title = formData.get("title")?.toString() || "";
  const description = formData.get("description")?.toString() || "";
  const videoUrl = formData.get("videoUrl")?.toString() || "";
  const quizStr = formData.get("quiz")?.toString() || "[]";
  const assignmentFile = formData.get("assignmentFile");

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

  //get the URL from AWS S3 bucket after uplaod 
  let pdfKey = "";
  if (assignmentFile && assignmentFile.size > 0) {
    // 6) Upload to S3
    try {
      const fileName = assignmentFile.name;   // e.g. "homework.pdf"
      const fileType = assignmentFile.type;   // e.g. "application/pdf"
      const timeSuffix = Date.now();          // to make it unique

      //File Upload from input field will result in File type to be Blob. AWS SDK expects Buffer, a readable string. 
      //arrayBuffer will read the entire Blob into memory as an ArrayBuffer, we then use Buffer.from to create a node js comptaible buffer
      // Convert Blob → ArrayBuffer → Buffer before calling s3.upload().
      const arrayBuffer = await assignmentFile.arrayBuffer();
      const fileBuffer = Buffer.from(arrayBuffer); 

      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `assignments/${teacherId}/${timeSuffix}_${fileName}`, // or any unique path
        Body: fileBuffer,
        ContentType: fileType,
      };

      const uploadResult = await s3.upload(uploadParams).promise();
      pdfKey = uploadParams.Key;
       
      console.log("PDF uploaded to S3:", pdfKey);
    } catch (error) {
      console.error("S3 upload error:", error);
      throw new Error("Failed to upload PDF to S3");
    }
  }

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
    pdfKey: pdfKey || "", // S3 URL if uploaded
    // completed defaults to false
  });

  // Return the new lesson ID (or anything you'd like to the client)
  return newLesson._id.toString();
}
