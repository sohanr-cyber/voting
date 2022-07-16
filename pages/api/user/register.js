import nc from "next-connect";
import bcrypt from "bcryptjs";
import User from "../../../models/Users";
import db from "../../../utils/db";
import { signToken } from "../../../utils/auth";

const handler = nc();

handler.post(async (req, res) => {
  try {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please Enter all the Feilds");
    }

    await db.connect();
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const newUser = new User({
      name,
      email,
      password: bcrypt.hashSync(req.body.password),
      pic,
    });
    const user = await newUser.save();
    await db.disconnect();

    const token = signToken(user);
    console.log(user);
    res.status(201).send({
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

export default handler;
