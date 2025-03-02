import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Links to User
  subjects: [{ type: String }], // Example: ["Math", "Science"]
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }], // Classes they manage
}, { timestamps: true });

export default mongoose.models.Teacher || mongoose.model("Teacher", TeacherSchema);
