const mongoose = require("mongoose");

const userProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: Date,
    pointsEarned: {
      type: Number,
      default: 0,
    },
    submissionLink: String, // optional: if they submit code or file
    notes: String, // optional: explanation or summary
  },
  { _id: false } // don't need an extra ObjectId for each progress entry
);

const challengeSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
    description: {
      type:String,
      default:"",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    userProgress: [userProgressSchema],
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
    votes: [
      {
        voter: { type: mongoose.Schema.Types.ObjectId, 
          ref: "User", 
          required: true },
        votedFor: { type: mongoose.Schema.Types.ObjectId,
           ref: "User",
            required: true }
      }
    ],
    evaluationMethod: {
      type: String,
      enum: ["auto", "vote", "admin"],
      default: "auto", // auto = based on completion time
    },
    flaggedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    points: {
      type: Number,
      default: 10, // base points for completing
    },
    bonusPoints: {
      type: Number,
      default: 1, // bonus for first completer
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Challenge", challengeSchema);
