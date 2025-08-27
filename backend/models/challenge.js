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
    submissionFileUrl: {
      type: String, // URL or path to the file submitted
      default: null, // null if no file submitted
    },
    submissionFilePublicId: {
      type: String, // public ID for the file in cloud storage (if applicable)
      default: null, // null if no file submitted
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
    isPrivate: {
      type: Boolean,
      default: false, // if true, only participants can see it
    },
    inviteCode: {
      type: String,
      unique: true, // ensure invite codes are unique
      sparse: true, // allow null values if challenge is public
     
    },
  },
  { timestamps: true }
);
// challengeSchema.index({ title:"text"});

module.exports = mongoose.models.Challenge || mongoose.model("Challenge", challengeSchema);
