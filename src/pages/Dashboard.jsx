import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Dash from "../components/Dash";
import LogoutIcon from "@mui/icons-material/Logout";
import { removeUser } from "../store/reducers/user.slice.js";
import Modal from "../components/Model";
import Card from "../components/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [area, setArea] = useState("No Location");
  const [todoCounts, setTodoCounts] = useState({
    totalTodos: 0,
    completedCount: 0,
    expiredCount: 0,
    remainingCount: 0,
  });
  const [todos, setTodos] = useState([]);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [loadingTodos, setLoadingTodos] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/todos/getDashboard",
        {},
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      setTodoCounts(response.data);
    } catch (error) {
      setError("Error fetching dashboard data.");
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoadingDashboard(false);
    }
  };

  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/todos/getTodos",
        {},
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      setTodos(response.data.todos);
      await location();
    } catch (error) {
      setError("Error fetching todos.");
      console.error("Error fetching todos:", error);
    } finally {
      setLoadingTodos(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchTodos();
  }, []);

  const handleLogout = () => {
    dispatch(removeUser());
    navigate("/");
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitTodo = async (todoData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/todos/addTodo", todoData, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      await fetchTodos();
      await fetchDashboardData();

      handleCloseModal();
    } catch (error) {
      setError("Error adding todo.");
      console.error("Error adding todo:", error);
    }
  };

  const handleEditTodo = async (id, updatedTodo) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/todos/updateTodo`,
        { id, ...updatedTodo },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchTodos();
      await fetchDashboardData();
    } catch (error) {
      setError("Error updating todo.");
      console.error("Error updating todo:", error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/api/todos/deleteTodo`,
        { id },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchTodos();
      await fetchDashboardData();
    } catch (error) {
      setError("Error deleting todo.");
      console.error("Error deleting todo:", error);
    }
  };

  const location = async () => {
    try {
      const response = await axios.get("/api/users/location");
      setArea(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen min-w-screen px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          Dashboard
        </h1>
        <h1 className="flex h-fit w-fit justify-between items-center">
          <div className=" text-red-500">
            <LocationOnIcon />
          </div>
          <div className="text-xl ">{area}</div>
        </h1>
        <button
          className="flex items-center gap-2 p-2 mt-4 sm:mt-0 cursor-pointer text-red-700"
          onClick={handleLogout}
        >
          <LogoutIcon />
          <span className="hidden sm:block text-lg">Logout</span>
        </button>
      </div>
      <div className="pt-6">
        {loadingDashboard ? (
          <div className="flex justify-center items-center h-full">
            <CircularProgress />
          </div>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Dash todoCounts={todoCounts} />
        )}
      </div>
      <div className="pt-6 flex justify-center">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleOpenModal}
        >
          Add New Todo
        </button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTodo}
        mode="add"
      />
      <div className="pt-6">
        {loadingTodos ? (
          <div className="flex justify-center items-center h-full">
            <CircularProgress />
          </div>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <div className="flex flex-col gap-4">
            {todos.map((todo) => (
              <Card
                key={todo.id}
                title={todo.title}
                status={todo.status}
                description={todo.description}
                dueDate={todo.time}
                onEdit={(updatedTodo) => handleEditTodo(todo.id, updatedTodo)}
                onDelete={() => handleDeleteTodo(todo.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
