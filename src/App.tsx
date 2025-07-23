import "./App.css";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import AddFoundItem from "./pages/AddFoundItem";
import AddLostItem from "./pages/AddLostItem";
import Layout from "./pages/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import AppTest from "./pages/AppTest";
import { LoadingProvider } from "./contextProviders/LoadingProvider";
import { SummaryItemProvider } from "./contextProviders/SummaryItemProvider";
import { DialogProvider } from "./contextProviders/DialogProvider";
import { FullScreenDialogProvider } from "./contextProviders/FullScreenDialogProvider";
const apiUrl = import.meta.env.VITE_API_URL;

const App = () => {
  const navigate = useNavigate();
  const isLogined = Boolean(window.localStorage.getItem("isLogined"));
  const [isLoading, setIsLoading] = useState<boolean>(isLogined);

  useEffect(() => {
    if (isLogined) {
      axios
        .get(`${apiUrl}/auth/verify`, { withCredentials: true })
        .then((response) => {
          window.localStorage.setItem(
            "isLogined",
            JSON.stringify(response.data)
          );
        })
        .catch(() => {
          window.localStorage.removeItem("isLogined");
          navigate("/login", { replace: true });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      window.localStorage.removeItem("isLogined");
      setIsLoading(false);
    }
  }, [isLogined, navigate]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <LoadingProvider>
      <Routes>
        <Route path="/test-api" element={<AppTest />} />
        <Route
          path="/login"
          element={isLogined ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={isLogined}>
              <SummaryItemProvider>
                <DialogProvider>
                  <FullScreenDialogProvider>
                    <Layout />
                  </FullScreenDialogProvider>
                </DialogProvider>
              </SummaryItemProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="add-found-item" element={<AddFoundItem />} />
          <Route path="add-lost-item" element={<AddLostItem />} />
        </Route>

        {/* fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </LoadingProvider>
  );
};

export default App;
