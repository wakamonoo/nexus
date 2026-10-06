"use client";
import { createContext, useEffect, useState } from "react";

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

let BASE_URL;

if (APP_ENV === "production") {
  BASE_URL = "https://nexus-po8x.onrender.com";
} else if (APP_ENV === "staging") {
  BASE_URL = "https://nexus-test-xxhl.onrender.com";
} else {
  BASE_URL = "http://localhost:4000";
}

export const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackLoad, setFeedbackLoad] = useState(true);

  useEffect(() => {
    const handleGetFeedbacks = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/feedbacks/feedbacksGet`, {
          method: "GET",
        });

        const data = await res.json();

        setFeedbacks(data);
      } catch (err) {
        console.error("failed to fetch feedbacks", err);
        setFeedbacks([]);
      } finally {
        setFeedbackLoad(false);
      }
    };
    handleGetFeedbacks();
  }, []);
  return (
    <FeedbackContext.Provider
      value={{
        feedbacks,
        setFeedbacks,
        feedbackLoad,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};
