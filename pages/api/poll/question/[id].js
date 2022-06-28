import nc from "next-connect";
import bcrypt from "bcryptjs";
import Poll from "../../../../models/Polls";
import db from "../../../../utils/db";

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

export default handler;
