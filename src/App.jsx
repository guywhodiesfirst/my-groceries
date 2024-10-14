import Navbar from "./Components/Navbar/Navbar"
import "./App.css"
import React, { useState } from "react"
import MainPage from "./Components/MainPage/MainPage"

export const Context = React.createContext()

export default function App() {
  const [orders, setOrders] = useState([])
  const [items, setItems] = useState([])

  return (
  <Context.Provider value={[orders, setOrders, items, setItems]}>
    <Navbar />
    <div className="wrapper">
      <MainPage />
    </div>
  </Context.Provider>
  )
}