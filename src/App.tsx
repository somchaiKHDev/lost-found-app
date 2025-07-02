import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import AddFoundItem from "./pages/AddFoundItem";
import AddLostItem from "./pages/AddLostItem";
import Login from "./pages/Login";
import axios from "axios";
import React, { useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  React.useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    axios
      .get(`${apiUrl}/auth/profile`, {
        withCredentials: true,
      })
      .then(() => {
        setIsLoggedIn(true);
      })
      .catch(() => {
        setIsLoggedIn(false);
      });
  };

  if (isLoggedIn === null) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/*"
        element={
          isLoggedIn ? (
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/add-found-item" element={<AddFoundItem />} />
                <Route path="/add-lost-item" element={<AddLostItem />} />
              </Routes>
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

export default App;
