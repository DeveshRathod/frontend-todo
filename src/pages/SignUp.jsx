import React, { useState } from "react";
import AuthWrapper from "../components/AuthWrapper";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "../store/reducers/user.slice";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
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

  const handleConfirmPassChange = (event) => {
    setConfirmPass(event.target.value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPass) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(`/api/users/signup`, {
        email: email,
        password: password,
        confirmPassword: confirmPass,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setEmail("");
      setPassword("");
      setConfirmPass("");
      dispatch(setUser(response.data.user));
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup failed:", error.message);
      setError(error.response?.data?.msg || "Signup failed. Please try again.");
    }
  };

  return (
    <AuthWrapper>
      <div className="flex items-center flex-col gap-6">
        <h1 className="font-semibold text-3xl text-[#33A013]">Sign Up</h1>
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
          <div className="relative">
            <input
              type="password"
              id="confirmPass"
              value={confirmPass}
              onChange={handleConfirmPassChange}
              className="w-full md:w-96 px-4 py-3 rounded-md outline-none shadow-inner"
              placeholder="Confirm Password"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-[#33A013] text-white w-full p-3 border border-[#33A013] hover:border-[#33A013] rounded-md hover:bg-white hover:text-[#33A013] transition duration-300 ease-in-out"
          >
            Sign Up
          </button>
          {error && <p className="mt-4 text-red-700">{error}</p>}
          {!error && (
            <p className="mt-4 text-gray-600">
              Already a user?{" "}
              <button
                onClick={() => navigate("/")}
                className="text-[#33A013] hover:underline focus:outline-none"
              >
                Sign In
              </button>
            </p>
          )}
        </form>
      </div>
    </AuthWrapper>
  );
};

export default Signup;
