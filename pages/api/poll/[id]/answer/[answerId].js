import nc from "next-connect";
import bcrypt from "bcryptjs";

import Poll from "../../../../../models/Polls";
import db from "../../../../../utils/db";
import { isAuth } from "../../../../../utils/auth";

const handler = nc();

handler.use(isAuth);
handler.put(async (req, res) => {
  try {
    await db.connect();
    const poll = await Poll.findOne({ _id: req.query.id });

    if (poll.creator == req.user._id) {
      poll.answers = await poll.answers.filter(
        (item) => item._id != req.query.answerId
      );
    }
    await poll.save();
    await db.disconnect();
    res.status(200).send({ poll, message: "succesfully deleted" });
  } catch (error) {}
});

export default handler;
