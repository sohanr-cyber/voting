import nc from "next-connect";
import bcrypt from "bcryptjs";
import Poll from "../../../models/Polls";
import db from "../../../utils/db";
import { signToken, isAuth } from "../../../utils/auth";

const handler = nc();

// handler.use();
handler.get(async (req, res) => {
  try {
    await db.connect();
    const polls = await Poll.find({}).sort({ createdAt: -1 });
    await db.disconnect();
    res.status(200).send(polls);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error });
  }
});

handler.use(isAuth);
handler.post(async (req, res) => {
  try {
    await db.connect();
    
    const newPoll = await new Poll({
      creator: req.user._id,
      question: req.body.question,
      singleVoted: req.body.singleVoted,
      changeAble: req.body.changeAble,
      onlyAdminCanChangeAns: req.body.onlyAdminCanChangeAns,
    });

    const poll = await newPoll.save();
    await db.disconnect();
    res.status(200).send(poll);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error });
  }
});

handler.delete(async (req, res) => {
  try {
    await db.connect();
    const deletePoll = await Poll.deleteOne({ _id: req.body.id });
    await db.disconnect();
    res.status(200).send({ message: "Deleted Successfully" });
  } catch (error) {
    console.log(error);
  }
});

export default handler;
