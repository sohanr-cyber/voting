import nc from "next-connect";
import bcrypt from "bcryptjs";
import User from "../../../models/Users";
import db from "../../../utils/db";
import { signToken } from "../../../utils/auth";

const handler = nc();

handler.post(async (req, res) => {
  try {
    const { email, password } = req.body;
    await db.connect();
    const user = await User.findOne({ email: email });
    console.log(user)
    if (!user)
      return res.status(404).send({ message: "No user with this Eamil" });
    await db.disconnect();
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = signToken(user);
      res.send({
        token,
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pic: user.pic,
      });
    } else {
      res.status(401).send({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

export default handler;
