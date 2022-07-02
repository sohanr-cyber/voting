import React, { useEffect } from "react";
import styles from "../../styles/Details.module.css";
import { useState } from "react";
import PieChat from "../../components/PieChat";
import Head from "next/head";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { SnackbarProvider, useSnackbar } from "notistack";

const Details = ({ id }) => {
  const [newAns, setNewAns] = useState("");
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  console.log({ id });

  const [openForm, setOpenForm] = useState(false);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [poll, setPoll] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const color = [
    "#e6194b",
    "#3cb44b",
    "#ffe119",
    "#4363d8",
    "#f58231",
    "#911eb4",
    "#46f0f0",
    "#f032e6",
    "#bcf60c",
    "#fabebe",
    "#008080",
    "#e6beff",
    "#9a6324",
    "#fffac8",
    "#800000",
    "#aaffc3",
    "#808000",
    "#ffd8b1",
    "#000075",
    "#808080",
    "#ffffff",
    "#000000",
  ];

  console.log({ fetchAgain });

  const format = (data) => {
    const obj = [];
    data.answers.forEach((answer, index) => {
      obj.push({
        name: answer.answer,
        value: answer.votes.length,
        fill: color[index],
      });
    });
    return obj;
  };

  console.log(data);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get(`/api/poll/question/${id}`);
        console.log("from useEffect");
        console.log(data);
        setPoll(data);
        setData(format(data));
      } catch (error) {
        enqueueSnackbar(error.message, { variant: "error" });
        console.log(error);
      }
    };

    fetch();
    setLoading(false);
  }, [fetchAgain, id]);

  const userInfo = useSelector((state) => state.user.userInfo);

  const percentage = (vote, totalVotes) => {
    if (vote == 0) return 0;
    return (vote.length / totalVotes.length) * 100;
  };

  const handleClick = async () => {
    try {
      if (newAns == "") {
        enqueueSnackbar("Option Cannot be Empty", { variant: "warning" });
        return;
      } 
      setLoading(true);
      const { data } = await axios.post(
        `/api/poll/${id}`,
        {
          answer: newAns,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      console.log({ data });

      enqueueSnackbar("A New Option Added", { variant: "success" });

      console.log(data);
      setFetchAgain((prev) => !prev);
      setOpenForm(false);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });

      setLoading(false);
      console.log(error);
    }
  };

  const removeOption = async (answerId) => {
    try {
      setLoading(true);
      const { data } = await axios.put(
        `/api/poll/${id}/answer/${answerId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      enqueueSnackbar("An Option removed", { variant: "info" });

      setFetchAgain((prev) => !prev);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "warning" });

      setLoading(false);
      console.log(error);
    }
  };

  const deletePoll = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.delete(`/api/poll/${id}/`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      setLoading(true);
      enqueueSnackbar("Poll deleted successfully");

      router.push("/");
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
      setLoading(false);
      console.log(error);
    }
  };

  // const removeVote = async (answerId) => {
  //   try {
  //     setLoading(true);
  //     const { data } = await axios.delete(`/api/poll/${id}/${answerId}`, {
  //       headers: {
  //         Authorization: `Bearer ${userInfo.token}`,
  //       },
  //     });
  //     setFetchAgain((prev) => !prev);
  //   } catch (error) {
  //     setLoading(false);

  //     console.log(error);
  //   }
  // };

  const addVote = async (answerId) => {
    try {
      !userInfo && enqueueSnackbar("Login To Participate");
      setLoading(true);
      const { data } = await axios.put(
        `/api/poll/${id}/${answerId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      console.log({ data });
      if (data.message == "Unchangeable") {
        enqueueSnackbar("Answer Can't be Changed", { variant: "warning" });
      }

      setFetchAgain((prev) => !prev);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <>
      <Head>
        <title>Poll {router.query.id}</title>
      </Head>
      <div className={styles.container}>
        {openForm ? (
          <div className={styles.form_container}>
            <form>
              <input
                type="text"
                className={styles.field}
                onChange={(e) => setNewAns(e.target.value)}
              />
              <div className={styles.flex_btn}>
                <div className={styles.add} onClick={() => handleClick()}>
                  Add
                </div>
                <div
                  className={styles.cancel}
                  onClick={() => setOpenForm(false)}
                >
                  Cancel
                </div>
              </div>
            </form>
          </div>
        ) : (
          <></>
        )}

        {loading ? (
          <div className={styles.form_container}>
            <CircularProgress />
          </div>
        ) : (
          <></>
        )}
        <div className={styles.left}>
          <div className={styles.question}>{poll.question}</div>

          <div className={styles.tag}>
            {!poll.changeAble && <span>Answer unChangeable</span>}
            {poll.singleVoted && <span>SingleVoted</span>}

            {poll.onlyAdminCanChangeAns && <span>onlyAdminCanChangeAns</span>}
          </div>
          <div className={styles.topRight}>
            <PieChat data={data} total={poll.totalVotes} />
          </div>
          {poll.answers?.map((answer, index) => (
            <div key={answer._id}>
              <div className={styles.time}></div>
              <div className={styles.answers}>
                <div className={styles.answerCard}>
                  <div className={styles.top}>
                    <div className={styles.answer}>{answer.answer}</div>
                    <div className={styles.selectBox}>
                      {poll.creator == userInfo?._id && (
                        <DeleteOutlineIcon
                          onClick={() => removeOption(answer._id)}
                        />
                      )}
                      {answer.votes.includes(userInfo?._id) ? (
                        <CheckBoxIcon onClick={() => addVote(answer._id)} />
                      ) : (
                        <CheckBoxOutlineBlankIcon
                          onClick={() => addVote(answer._id)}
                        />
                      )}
                    </div>
                  </div>
                  <div className={styles.percentBorder}>
                    <div
                      className={styles.percent}
                      style={{
                        width: `${percentage(answer.votes, poll.totalvotes)}%`,
                        background: color[index],
                      }}
                    ></div>
                  </div>
                  <div className={styles.voters}>
                    <div className={styles.votes}>
                      {answer.votes.length} votes
                    </div>
                    <div className={styles.pernums}>
                      {percentage(answer.votes, poll.totalvotes).toFixed(2)} %
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {userInfo ? (
            poll.onlyAdminCanChangeAns ? (
              userInfo?._id == poll.creator ? (
                <>
                  <div
                    className={styles.addans}
                    onClick={() => setOpenForm(true)}
                  >
                    Add An Option
                  </div>
                </>
              ) : (
                <div className={styles.addans}>
                  Only Questioner Can Add Answer
                </div>
              )
            ) : (
              <>
                {" "}
                <div
                  className={styles.addans}
                  onClick={() => setOpenForm(true)}
                >
                  Add An Option
                </div>
              </>
            )
          ) : (
            <div
              className={styles.addans}
              onClick={() => router.push(`/login?redirect=${id}`)}
            >
              Login To Perticipate
            </div>
          )}

          {poll.creator == userInfo?._id && (
            <div
              className={styles.addans}
              onClick={() => {
                deletePoll(poll._id);
              }}
              style={{ backgroundColor: "rgb(245, 0, 0, 0.1)", color: "red" }}
            >
              Delete Poll
            </div>
          )}
        </div>
        <div className={styles.right}>
          <PieChat data={data} total={poll.totalVotes} />
        </div>
      </div>
    </>
  );
};

export default Details;

export async function getServerSideProps(context) {
  const { params } = context;
  const { id } = params;

  return {
    props: { id },
  };
}
