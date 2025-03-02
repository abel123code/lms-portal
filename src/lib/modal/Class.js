import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Example: "Saturday 8AM Science Class"
  subject: { type: String, required: true }, // Example: "Science"
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true }, // Assigned teacher
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }], // Enrolled students
}, { timestamps: true });

export default mongoose.models.Class || mongoose.model("Class", ClassSchema);
