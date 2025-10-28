"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "./userContext";

export const SocketContext = createContext();

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export const SocketProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [chatLoad, setChatLoad] = useState(true);
  const { user, socket } = useContext(UserContext);
  const [pings, setPings] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/messages/messageGet`);
        const data = await res.json();
        setMessages(data);
        setChatLoad(false);
      } catch (err) {
        console.error("failed to fetch messages", err);
      }
    };
    fetchMessages();
    socket.on("citadel", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => {
      socket.off("citadel");
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchPings = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/pings/pingGet/${user.uid}`);
        const pingData = await res.json();

        setPings(pingData || []);
      } catch (err) {
        console.error("failed to fetch pings", err);
      }
    };

    fetchPings();

    socket.on("ping", (pingData) => {
      console.log("Received ping:", pingData);
      setPings((prev) => [...prev, pingData]);
    });

    return () => {
      socket.off("ping");
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ messages, setMessages, chatLoad, pings, setPings }}>
      {children}
    </SocketContext.Provider>
  );
};
