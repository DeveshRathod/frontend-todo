import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Dash from "../components/Dash";
import LogoutIcon from "@mui/icons-material/Logout";
import { removeUser } from "../store/reducers/user.slice.js";
import Modal from "../components/Model";
import Card from "../components/Card";
import Alert from "@mui/material/Alert";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Loading from "../components/Loading";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRequestInProgress, setIsRequestInProgress] = useState(false);

  const handleRequest = async (requestFn, withFetch = true) => {
    if (isRequestInProgress) return;
    setIsRequestInProgress(true);
    try {
      setLoading(true);
      await delay(3000);
      await requestFn();

      if (withFetch) {
        await fetchTodos();
        await fetchDashboardData();
      }
    } catch (error) {
      setError("An error occurred.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setIsRequestInProgress(false);
    }
  };

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `/api/todos/getDashboard`,
      {},
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    setTodoCounts(response.data);
  };

  const fetchTodos = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `/api/todos/getTodos`,
      {},
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    setTodos(response.data.todos);
    await location();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await delay(1000);
        await fetchDashboardData();
        await fetchTodos();
      } catch (error) {
        setError("Error fetching initial data.");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
    const token = localStorage.getItem("token");
    const requestFn = async () => {
      await axios.post(`/api/todos/addTodo`, todoData, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      handleCloseModal();
    };

    handleRequest(requestFn);
  };

  const handleEditTodo = async (id, updatedTodo) => {
    const token = localStorage.getItem("token");
    const requestFn = async () => {
      await axios.put(
        `/api/todos/updateTodo`,
        { id, ...updatedTodo },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
    };

    handleRequest(requestFn);
  };

  const handleDeleteTodo = async (id) => {
    const token = localStorage.getItem("token");
    const requestFn = async () => {
      await axios.post(
        `/api/todos/deleteTodo`,
        { id },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
    };

    handleRequest(requestFn);
  };

  const location = async () => {
    try {
      const response = await axios.get(`/api/users/location`);
      setArea(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen min-w-screen px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Dashboard
            </h1>
            <h1 className="flex h-fit w-fit justify-between items-center">
              <div className="text-red-500">
                <LocationOnIcon />
              </div>
              <div className="text-xl">{area}</div>
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
            {error ? (
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
            {error ? (
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
                    onEdit={(updatedTodo) =>
                      handleEditTodo(todo.id, updatedTodo)
                    }
                    onDelete={() => handleDeleteTodo(todo.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
