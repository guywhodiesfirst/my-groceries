import Navbar from './Components/UI/Navbar/Navbar';
import './App.css';
import React, { useState, useEffect } from 'react';
import MainPage from './Components/MainPage/MainPage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AccountPage from './Components/AccountPage/AccountPage';
import RegistrationPage from './Components/Auth/RegistrationPage/RegistrationPage';
import LoginPage from './Components/Auth/LoginPage/LoginPage';
import AdminPage from './Components/AdminPage/AdminPage';
import PaymentPage from './Components/PaymentPage/PaymentPage.jsx'
import { AuthApi } from './api/AuthApi.js';

export const Context = React.createContext();

export default function App() {
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (token) {
      setIsAuthenticated(true);
      fetchUserProfile(token);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const result = await AuthApi.getUserProfile();
      if (result.error) {
        localStorage.removeItem('access_token');
      } else {
        setUser(result);
      }
    }
  };

  return (
    <Router>
      <Context.Provider value={{ orders, setOrders, items, setItems, isAuthenticated, setIsAuthenticated, user }}>
        <Navbar/>
        <div className="wrapper">
          <Routes>
            <Route path="/" element={<Navigate to="/catalog"/>}/>
            <Route path="/catalog" element={<MainPage/>}/>
            <Route path="/account" element={<AccountPage/>}/>
            <Route path="/register" element={<RegistrationPage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/admin" element={<AdminPage/>}/>
            <Route path="/payment" element={<PaymentPage />}/>
          </Routes>
        </div>
      </Context.Provider>
    </Router>
  );
}
