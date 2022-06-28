import React, { useState } from "react";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import axios from "axios";

import { useRouter } from "next/router";
import Head from "next/head";

const Home = ({ data }) => {
  const [nums, setNums] = useState([1, 2, 3, 4, 5]);
  console.log(data);
  const router = useRouter();


  const totalVotes = (question) => {
    let totalVotes = [];
    question.answers.forEach((answer) => {
      totalVotes = [...totalVotes, ...answer.votes];
    });
    return totalVotes;
  };

  const percentage = (vote, totalVotes) => {
    if (vote == 0) return 0;
    return (vote.length / totalVotes.length) * 100;
  };
  return (
    <>
       <Head>
        <title>Poll</title>
      </Head>
      <div className={styles.home_container}>
        <div className={styles.top}>
          <span className={styles.heading}>Open Votes</span>
          <span className={styles.numbers}>{data.length}</span>
        </div>
        <div className={styles.openVotes}>
          {data.map((poll, k) => (
            <div className={styles.vote} key={k}>
              <div className={styles.top}></div>
              <div className={styles.card}>
                <div className={styles.question}>{poll.question}</div>
                <div className={styles.answers}>
                  {poll.answers.slice(0, 3).map((answer, k) => (
                    <div className={styles.answer} key={k}>
                      <div className={styles.value}>{answer?.answer}</div>
                      <div className={styles.percentBorder}>
                        <div
                          className={styles.percent}
                          style={{
                            width: `${percentage(
                              answer.votes,
                              totalVotes(poll)
                            )}%`,
                         
                          }}
                        >
                          {/* {answer && totalVotes(poll).length}
                          {answer && percentage(answer.votes, totalVotes(poll))} */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className={styles.btn}
                  onClick={() => router.push(`/poll/${poll._id}`)}
                >
                  View Details
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;

export async function getServerSideProps(context) {
  const { data } = await axios.get(" http://localhost:3000/api/poll/");

  if (!data) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { data }, // will be passed to the page component as props
  };
}
