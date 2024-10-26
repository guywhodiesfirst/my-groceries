import Navbar from "./Components/Navbar/Navbar"
import "./App.css"
import React, { useState } from "react"
import MainPage from "./Components/MainPage/MainPage"
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AccountPage from "./Components/AccountPage/AccountPage"

export const Context = React.createContext()

export default function App() {
  const [orders, setOrders] = useState([])
  const [items, setItems] = useState([])

  return (
    <Router>
        <Context.Provider value={[orders, setOrders, items, setItems]}>
          <Navbar />
          <div className="wrapper">
            <Routes>
              <Route path="/" element={<Navigate to="/catalog"/>} />
              <Route path="/catalog" element= {<MainPage />} />
              <Route path="/account" element= {<AccountPage />} />
            </Routes>
          </div>
        </Context.Provider>
    </Router>
  )
}