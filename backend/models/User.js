const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profileImage: {
      type: String,
      default: "", // avoids undefined
    },
    profileImagePublicId: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      maxlength: 300, // prevents abuse
      default: "",
    },
    points: {
      type: Number,
      default: 0,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    socialLinks: {
      github: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    isFirstLogin: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);


module.exports = mongoose.models.User || mongoose.model("User", userSchema);
// This code defines a Mongoose schema for a User model in a Node.js application.
