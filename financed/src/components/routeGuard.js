"use client";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { isLoggedInAtom } from "@/store";
import { tokenAtom } from "@/store";
import Error from "@/components/error";

export default function RouteGuard({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const [loading, setLoading] = useState(true);
  const [, setToken] = useAtom(tokenAtom);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      setToken(storedToken);
      setIsLoggedIn(!!storedToken);
      setLoading(false);
    }
  });

  if (loading) return <>Loading...</>;
  else
    return isLoggedIn ? (
      children
    ) : (
      <Error message="You must be logged in to access this page." />
    );
}
