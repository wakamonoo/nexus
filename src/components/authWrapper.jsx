"use client";
import { useContext } from "react";
import { UserContext } from "@/context/userContext";
import Loader from "./loader";

export default function AuthWrapper({ children }) {
  const { loading } = useContext(UserContext);

  if (loading) {
    return <Loader />;
  }

  return <>{children}</>;
}
