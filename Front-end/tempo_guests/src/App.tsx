import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import DishesPage from "./pages/DishesPage/DishesPage";
import CartPage from "./pages/CartPage/CartPage";
import OrderPage from "./pages/OrderPage/orderPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dishes" element={<DishesPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/" element={<Navigate replace to={"/login"} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
