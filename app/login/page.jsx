"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import cryptoRandomString from "crypto-random-string";
import Cookies from "js-cookie";

const LoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    console.log("clicked");

    const validUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
    const validPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (username === validUsername && password === validPassword) {
      // Set a crypto-random-string as the token
      const token = cryptoRandomString({ length: 32, type: "url-safe" });

      Cookies.set("admin_token", token, { expires: 1/24 });

      // Redirect to the admin dashboard or any other protected route
      router.push("/");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="w-screen h-[70vh] flex items-center justify-center">
      <div className="flex flex-col items-center bg-white p-4 rounded-xl">
        <p>Only admin of this website can access this webpage</p>
        <div>
          <label>
            <input
              type="text"
              className="rounded-md my-1"
              value={username}
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            <input
              type="password"
              className="rounded-md my-1"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button
          onClick={handleLogin}
          className="bg-[#F17E13] py-2 px-5 text-white shadow-md shadow-[#F17E13] mt-3 rounded-lg"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;