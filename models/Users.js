import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    pic: { type: String },
  },
  { timestaps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
