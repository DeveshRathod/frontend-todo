import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser, removeUser } from "../store/reducers/user.slice.js";

const PrivateRoute = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.post(
            "/api/users/checkMe",
            {},
            {
              headers: {
                authorization: `Bearer ${token}`,
              },
            }
          );

          const userData = response.data.user;
          console.log(userData);
          dispatch(setUser(userData));
        } else {
          dispatch(removeUser());
          navigate("/");
        }
      } catch (error) {
        dispatch(removeUser());
        navigate("/");
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUser();
  }, [dispatch, navigate]);

  return user ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
