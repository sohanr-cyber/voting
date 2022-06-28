import React, { useState } from "react";
import styles from "../styles/Form.module.css";
import Link from "next/link";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { login } from "../redux/userSlice";
import { SnackbarProvider, useSnackbar } from "notistack";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    try {
      if (name == "" || password == "" || email == "") {
        enqueueSnackbar("Fill All the FIeld", { variant: "warning" });
        return;
      }
      const { data } = await axios.post("/api/user/register", {
        name,
        email,
        password,
      });

      dispatch(login(data));
      enqueueSnackbar("Succesfully Registered", { variant: "sucess" });

      const url = router.query.redirect
        ? `/poll/${router.query.redirect}`
        : "/";

      router.push(url);
    } catch (error) {
      console.log(error);
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  return (
    <div className={styles.form_container}>
      <form>
        <input
          type="text"
          placeholder="Name"
          className={styles.field}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <input
          type="email"
          placeholder="Email"
          className={styles.field}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Password"
          className={styles.field}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <div
          className={styles.btn}
          onClick={() => {
            handleSubmit();
          }}
        >
          Submit
        </div>
        <div className={styles.link}>
          Already Have an account?
          <div className={styles.ref}>
            <Link href="login">Login</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
