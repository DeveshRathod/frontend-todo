import React, { useState } from "react";
import AuthWrapper from "../components/AuthWrapper";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "../store/reducers/user.slice";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Signin = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.id]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/users/signin`,
        credentials
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      dispatch(setUser(response.data.user));
      setCredentials({ email: "", password: "" });
      navigate("/dashboard");
    } catch (error) {
      console.error("Signin failed:", error.message);
      setError(error.response?.data?.msg || "Signin failed. Please try again.");
    }
  };

  return (
    <AuthWrapper>
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-3xl font-semibold text-[#33A013]">Sign In</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-4 w-full md:w-96"
        >
          <input
            type="email"
            id="email"
            value={credentials.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-md outline-none shadow-inner"
            placeholder="Email"
            required
          />
          <input
            type="password"
            id="password"
            value={credentials.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-md outline-none shadow-inner"
            placeholder="Password"
            required
          />
          <button
            type="submit"
            className="w-full p-3 text-white bg-[#33A013] border border-[#33A013] rounded-md hover:bg-white hover:text-[#33A013] transition duration-300"
          >
            Sign In
          </button>
          {error && <p className="mt-4 text-red-700">{error}</p>}
          {!error && (
            <p className="mt-4 text-gray-600">
              Not a user?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-[#33A013] hover:underline"
              >
                Sign Up
              </button>
            </p>
          )}
        </form>
      </div>
    </AuthWrapper>
  );
};

export default Signin;
