import nc from "next-connect";
import bcrypt from "bcryptjs";
import Poll from "../../../../models/Polls";
import db from "../../../../utils/db";
import { signToken, isAuth } from "../../../../utils/auth";

const handler = nc();

handler.get(async (req, res) => {
  try {
    await db.connect();
    const poll = await Poll.findOne({ _id: req.query.id });
    let totalvotes = [];
    poll.answers.forEach((answer) => {
      totalvotes = [...totalvotes, ...answer.votes];
    });

    await db.disconnect();
    res.status(200).send({ ...poll._doc, totalvotes });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error });
  }
});

handler.delete(async (req, res) => {
  try {
    await db.connect();
    const deletePoll = await Poll.deleteOne({ _id: req.query.id });
    await db.disconnect();
    res.status(200).send({ message: "Deleted Successfully" });
  } catch (error) {
    console.log(error);
  }
});

handler.use(isAuth);
handler.post(async (req, res) => {
  try {
    await db.connect();
    req.body.answer == "" && res.status(400).send({ message: "Set Answer" });
    const existAns = await Poll.findOne({ _id: req.query.id });
    const onlyAdminCanChangeAns = existAns.onlyAdminCanChangeAns;
    console.log({ onlyAdminCanChangeAns });

    if (onlyAdminCanChangeAns) {
      if (existAns.creator != req.user._id) {
        return res.status(200).send({
          message:
            "Your are not allowed to add extra vote, only questioner can do so",
        });
      }
    }

 
    const poll = await Poll.updateOne(
      { _id: req.query.id },
      {
        $push: {
          answers: {
            answer: req.body.answer,
          },
        },
      }
    );
    // const pollWithVote = poll.answers.push({ answer: req.body.answer });
    await db.disconnect();
    res.status(200).send(poll);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error });
  }
});

export default handler;
