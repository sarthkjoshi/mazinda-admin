'use client'

// components/AuthWrapper.js
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const AuthWrapper = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("admin_token");

    // If token is not present, redirect to the login page
    if (!token) {
      router.push("/auth/login");
    }
  }, [router]);

  // Render the children only if there is a token
  return (
    <>
      {Cookies.get("token") ? (
        <div>{children}</div>
      ) : (
        <p>Loading...</p> // or a login screen
      )}
    </>
  );
};

export default AuthWrapper;