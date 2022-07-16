import mongoose from "mongoose";

const answerSchema = mongoose.Schema({
  answer: { type: String },
  votes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
});

const pollSchema = mongoose.Schema(
  {
    question: {
      type: String,
    },
    singleVoted: { type: Boolean, default: false },
    changeAble: { type: Boolean, default: true },
    onlyAdminCanChangeAns: { type: Boolean, default: false },

    answers: [answerSchema],
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestaps: true }
);

const Poll = mongoose.models.Poll || mongoose.model("Poll", pollSchema);
export default Poll;
