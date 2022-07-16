import nc from "next-connect";
import bcrypt from "bcryptjs";
import Poll from "../../../models/Polls";
import db from "../../../utils/db";
import { signToken, isAuth } from "../../../utils/auth";

const handler = nc();

handler.use();

handler.get(async (req, res) => {
  try {
    await db.connect();
    const polls = await Poll.find({});
    await db.disconnect();
    res.status(200).send(polls);
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});
