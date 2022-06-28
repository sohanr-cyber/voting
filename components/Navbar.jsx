import styles from "../styles/Navbar.module.css";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

import Link from "next/link";
import { CircularProgress } from "@mui/material";
import { logout } from "../redux/userSlice";
import { SnackbarProvider, useSnackbar } from "notistack";

const Navbar = () => {
  const [newVoteForm, setNewVoteForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [singleVoted, setSingleVoted] = useState(false);
  const [changeAble, setChangeAble] = useState(true);
  const [onlyAdminCanChangeAns, setOnlyAdminCanChangeAns] = useState(false);
  const [question, setQuestion] = useState(null);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  console.log(question);
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const router = useRouter();

  const handleSubmit = async (req, res) => {
    try {
      if (!question) {
        enqueueSnackbar("Your Question cannot be Empty!", { variant: "error" });

        return;
      }
      setLoading(true);
      const { data } = await axios.post(
        "/api/poll",
        {
          question,
          changeAble,
          onlyAdminCanChangeAns,
          singleVoted,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      enqueueSnackbar("New Question Created", { variant: "success" });

      setLoading(false);
      setNewVoteForm(false);
      router.push(`/poll/${data._id}`);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <>
      {newVoteForm ? (
        <>
          {" "}
          <div className={styles.questionForm}>
            <form>
              <textarea
                placeholder="Your Question"
                onChange={(e) => setQuestion(e.target.value)}
              ></textarea>
              <div className={styles.options}>
                <div className={styles.option}>
                  {singleVoted ? (
                    <CheckBoxOutlineBlankIcon
                      onClick={() => setSingleVoted(false)}
                    />
                  ) : (
                    <CheckBoxIcon onClick={() => setSingleVoted(true)} />
                  )}

                  <div className={styles.name}>User can give multiple vote</div>
                </div>
                <div className={styles.option}>
                  {onlyAdminCanChangeAns ? (
                    <CheckBoxOutlineBlankIcon
                      onClick={() => setOnlyAdminCanChangeAns(false)}
                    />
                  ) : (
                    <CheckBoxIcon
                      onClick={() => setOnlyAdminCanChangeAns(true)}
                    />
                  )}

                  <div className={styles.name}>User Can Set Option</div>
                </div>
                <div className={styles.option}>
                  {changeAble ? (
                    <CheckBoxIcon onClick={() => setChangeAble(false)} />
                  ) : (
                    <CheckBoxOutlineBlankIcon
                      onClick={() => setChangeAble(true)}
                    />
                  )}

                  <div className={styles.name}>User Can Change Vote</div>
                </div>
              </div>
              <div className={styles.flex_btn}>
                {" "}
                <div className={styles.add} onClick={() => handleSubmit()}>
                  {loading ? <CircularProgress /> : <>Add</>}
                </div>
                <div
                  className={styles.cancel}
                  onClick={() => setNewVoteForm(false)}
                >
                  Cancel
                </div>
              </div>
            </form>
          </div>
        </>
      ) : (
        <></>
      )}
      <div className={styles.nav_container}>
        <Link href="/">
          <div className={styles.logo}>
            <Image src="/assets/poll.png" width="25px" height="21px" alt="" />
            <span>Poll</span>
          </div>
        </Link>

        <div className={styles.right}>
          <div
            className={`${styles.sign} ${
              router.asPath == "/" && styles.active
            }`}
          >
            <Link href="/">Home</Link>
          </div>
          <>
            {!userInfo ? (
              <>
                <div
                  className={`${styles.sign} ${
                    router.asPath == "/login" && styles.active
                  }`}
                >
                  <Link style={{ textDecoration: "none" }} href="/login">
                    Login
                  </Link>
                </div>
                <div
                  className={`${styles.sign} ${
                    router.asPath == "/register" && styles.active
                  }`}
                >
                  <Link href="/register">Register</Link>
                </div>
              </>
            ) : (
              <div
                className={styles.sign}
                onClick={() => {
                  dispatch(logout());
                  router.push("/login");
                }}
              >
                Logout
              </div>
            )}

            {userInfo && (
              <div
                className={styles.btn}
                style={{
                  backgroundColor: "skyblue",
                }}
                onClick={() => setNewVoteForm(true)}
              >
                New <span>+</span>
              </div>
            )}
          </>
        </div>
      </div>
    </>
  );
};

export default Navbar;
