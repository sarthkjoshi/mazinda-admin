"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import cryptoRandomString from "crypto-random-string";
import Cookies from "js-cookie";

const LoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
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

  useEffect(() => {
    let token = Cookies.get("admin_token");
    if (token){
        router.push("/");
    }
  }, [])
  

  return (
    <div className="w-screen h-[70vh] flex items-center justify-center">
      <form className="flex flex-col items-center bg-white p-4 rounded-xl" onSubmit={e => e.preventDefault()}>
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
          type="submit"
          className="bg-[#F17E13] py-2 px-5 text-white shadow-md shadow-[#F17E13] mt-3 rounded-lg"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;