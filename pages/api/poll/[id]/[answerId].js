import nc from "next-connect";
import bcrypt from "bcryptjs";

import Poll from "../../../../models/Polls";
import db from "../../../../utils/db";
import { isAuth } from "../../../../utils/auth";

const handler = nc();

handler.use(isAuth);

handler.put(async (req, res) => {
  try {
    await db.connect();
    const poll = await Poll.findOne({ _id: req.query.id });

    //if not ChangeAble

    if (!poll.changeAble) {
      let total = [];
      const totalVoters = poll.answers.forEach((answer) => {
        let votes = [];
        answer.votes.forEach((vote) => {
          votes = [...votes, vote.toString()];
        });
        total = [...total, ...votes];
        return total;
      });
      console.log(total);
      console.log(total.includes(req.user._id));

      if (total.includes(req.user._id)) {
        return res.send({ message: "Unchangeable" });
      }
    }

    // if single voted -- pull user from every votes first
    if (poll.singleVoted) {
      poll.answers.forEach((answer) => {
        answer.votes = answer.votes.filter((vote) => vote != req.user._id);
      });
    }

    //if mulitple vote allowed
    //find Ans + add vote

    const existedAns = poll.answers.find(
      (answer) => answer._id == req.query.answerId
    );

    // console.log({ existedAns });
    const existVote = existedAns.votes.find((vote) => vote == req.user._id);
    if (!existVote) {
      existedAns.votes.push(req.user._id);
    } else {
      existedAns.votes = existedAns.votes.filter(
        (vote) => vote != req.user._id
      );
    }

    const updatePoll = await poll.save();
    console.log(updatePoll);
    return res.status(200).send(updatePoll);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

handler.delete(async (req, res) => {
  try {
    await db.connect();
    const poll = await Poll.findOne({ _id: req.query.id });
    console.log(poll);
    if (!poll.changeAble) {
      return res.status(200).send({ message: "You Can't Undo" });
    } else {
      const answer = poll.answers.find(
        (item) => item._id == req.query.answerId
      );

      console.log(answer);
      answer.votes = answer.votes.filter((user) => user._id != req.user._id);

      const updatedPoll = await poll.save();
      await db.disconnect();
      res.status(200).send(updatedPoll);
    }
  } catch (error) {
    console.log(error);
  }
});

handler.get(async (req, res) => {
  try {
    await db.connect();
    const polls = await Poll.findOne({ _id: req.query.id });

    await db.disconnect();
    res.status(200).send(polls);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error });
  }
});

export default handler;
