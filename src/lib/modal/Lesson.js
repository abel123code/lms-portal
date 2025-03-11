import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Lesson title
  description: { type: String }, // Teacher's written notes for students
  videoUrl: { type: String, required: true }, // Video hosted on S3 or an external platform
  storageType: { type: String, enum: ["s3", "external"], default: "external" }, // Determines if video is stored in S3 or externally
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true }, // Teacher who assigned the lesson
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true }, // Student assigned to this lesson
  pdfKey: { type: String, default: ""}, //Store the s3 URL for this assignment PDF
  quiz: [
    {
      question: { type: String, required: true },
      options: [{ type: String, required: true }], // Array of multiple-choice options
      correctAnswer: { type: String, required: true }, // The correct answer
    },
  ],
  completed: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Lesson || mongoose.model("Lesson", LessonSchema);
