import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import AddFoundItem from "./pages/AddFoundItem";
import AddLostItem from "./pages/AddLostItem";
import Login from "./pages/Login";

const App = () => {
  let location = useLocation();
  
  return location.pathname !== "/login" ? (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-found-item" element={<AddFoundItem />} />
        <Route path="/add-lost-item" element={<AddLostItem />} />
      </Routes>
    </Layout>
  ) : (
    <Routes>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default App;
