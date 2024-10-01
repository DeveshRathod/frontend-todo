import React, { useState } from "react";
import Authwrapper from "../components/AuthWrapper";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/reducers/user.slice";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError("");
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/users/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.user);
        const temp = data.token;
        localStorage.setItem("token", temp);
        localStorage.setItem("user", JSON.stringify(data.user));
        setEmail("");
        setPassword("");
        dispatch(setUser(data.user));
        navigate("/dashboard");
      } else {
        const errorData = await response.json();
        setError(errorData.msg || "Signin failed");
      }
    } catch (error) {
      console.error("Signin failed:", error.message);
      setError("Signin failed. Please try again.");
    }
  };

  return (
    <Authwrapper>
      <div className="flex items-center flex-col gap-6">
        <h1 className="font-semibold text-3xl text-[#33A013]">Sign In</h1>
        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-center flex-col gap-4"
        >
          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full md:w-96 px-4 py-3 rounded-md outline-none shadow-inner"
              placeholder="Email"
              required
            />
          </div>
          <div className="relative">
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full md:w-96 px-4 py-3 rounded-md outline-none shadow-inner"
              placeholder="Password"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-[#33A013] text-white w-full p-3 border border-[#33A013] hover:border-[#33A013] rounded-md hover:bg-white hover:text-[#33A013] transition duration-300 ease-in-out"
          >
            Sign In
          </button>
          {error && <p className="mt-4 text-red-700">{error}</p>}
          {!error && (
            <p className="mt-4 text-gray-600">
              Not a user?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-[#33A013] hover:underline focus:outline-none"
              >
                Sign Up
              </button>
            </p>
          )}
        </form>
      </div>
    </Authwrapper>
  );
};

export default Signin;
