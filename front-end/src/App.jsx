import Navbar from "./Components/UI/Navbar/Navbar";
import "./App.css";
import React, { useState, useEffect } from "react";
import MainPage from "./Components/MainPage/MainPage";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AccountPage from "./Components/AccountPage/AccountPage";
import RegistrationPage from "./Components/Auth/RegistrationPage/RegistrationPage";
import LoginPage from "./Components/Auth/LoginPage/LoginPage";
import AdminPage from './Components/AdminPage/AdminPage';

export const Context = React.createContext();

export default function App() {
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
  
    if (token) {
      setIsAuthenticated(true);
      fetchUserProfile(token);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        console.error("Failed to fetch user data");
        alert("Failed to fetch user data");
      }
    } catch(error) {
      console.error("Failure during user fetch:", error);
      alert("Failure during user fetch");
    }
  };

  return (
    <Router>
        <Context.Provider value={{orders, setOrders, items, setItems, isAuthenticated, setIsAuthenticated, user}}>
          <Navbar />
          <div className="wrapper">
            <Routes>
              <Route path="/" element={<Navigate to="/catalog"/>} />
              <Route path="/catalog" element={<MainPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/register" element={<RegistrationPage />}/>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={<AdminPage/>}/>
            </Routes>
          </div>
        </Context.Provider>
    </Router>
  );
}
