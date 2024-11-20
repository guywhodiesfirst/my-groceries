import { useContext, useState, useEffect } from "react";
import { Context } from "../../App";
import './AccountPage.css'

export default function AccountPage() {
  const { user } = useContext(Context);

  useEffect(() => {
    console.log("User in AccountPage:", user);
  }, [user]);

  return (
    <>
      {user ? (
        <div className="profile-data">
          {user.cardCVV && <h2>CVV: {user.cardCVV}</h2>}
          {user.cardDate && <h2>Card expire date: {user.cardDate}</h2>}
          {user.cardNumber && <h2>Card number: {user.cardNumber}</h2>}
          {user.deliveryMethod && <h2>Delivery method: {user.deliveryMethod}</h2>}
          {user.deliveryPlace && <h2>Delivery place: {user.deliveryPlace}</h2>}
          {user.name && <h2>First name: {user.name}</h2>}
          {user.surname && <h2>Last name: {user.surname}</h2>}
          {user.username && <h2>username: {user.username}</h2>}
        </div>
      ) : (
        <p>User data not available</p>
      )}
    </>
  );
}
