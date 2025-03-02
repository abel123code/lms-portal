// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    name: { type: String },
    googleId: { type: String },
    image: { type: String },  
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },
    vetted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
