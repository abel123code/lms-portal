import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Links to User
  enrolledClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }], // Classes they are in
}, { timestamps: true });

export default mongoose.models.Student || mongoose.model("Student", StudentSchema);
