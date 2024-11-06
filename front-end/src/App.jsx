import Navbar from "./Components/Navbar/Navbar"
import "./App.css"
import React, { useState, useEffect } from "react"
import MainPage from "./Components/MainPage/MainPage"
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AccountPage from "./Components/AccountPage/AccountPage"
import RegistrationPage from "./Components/Auth/RegistrationPage/RegistrationPage"
import LoginPage from "./Components/Auth/LoginPage/LoginPage"

export const Context = React.createContext()

export default function App() {
  const [orders, setOrders] = useState([])
  const [items, setItems] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token)
    console.log(isAuthenticated)
  }, []);

  return (
    <Router>
        <Context.Provider value={{orders, setOrders, items, setItems, isAuthenticated, setIsAuthenticated}}>
          <Navbar />
          <div className="wrapper">
            <Routes>
              <Route path="/" element={<Navigate to="/catalog"/>} />
              <Route path="/catalog" element= {<MainPage />} />
              <Route path="/account" element= {<AccountPage />} />
              <Route path="/register" element= {<RegistrationPage />}/>
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </div>
        </Context.Provider>
    </Router>
  )
}