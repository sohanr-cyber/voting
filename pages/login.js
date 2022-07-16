import React, { useState } from "react";
import styles from "../styles/Form.module.css";
import Link from "next/link";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { login } from "../redux/userSlice";
import { SnackbarProvider, useSnackbar } from "notistack";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const router = useRouter();
  const dispatch = useDispatch();
  console.log(router);

  const handleSubmit = async (password, email) => {
    try {
      if (password == "" || email == "") {
        enqueueSnackbar("Fill Al The Field", { variant: "warning" });

        return;
      }
      const { data } = await axios.post("/api/user/login", {
        email,
        password,
      });
      console.log(data);
      dispatch(login(data));
      enqueueSnackbar("Successfully Logged In", { variant: "success" });

      const url = router.query.redirect
        ? `/poll/${router.query.redirect}`
        : "/";
      router.push(url);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
      console.log(error);
    }
  };

  return (
    <div className={styles.form_container}>
      <form>
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
          onClick={() => handleSubmit(password, email)}
        >
          Submit
        </div>
        <div
          className={styles.btn}
          onClick={() => handleSubmit("123", "guestuser@gmail.com")}
        >
          Login in As Guest user
        </div>
        <div className={styles.link}>
          Already Have an account?
          <div>
            <Link
              href={
                router.query
                  ? `/register?redirect=${router.query.redirect}`
                  : "/register"
              }
            >
              Register
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
