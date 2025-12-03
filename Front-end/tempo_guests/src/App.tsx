import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { IKContext } from "imagekitio-react";
import LoginPage from "./pages/loginPage/LoginPage";
import DishesPage from "./pages/DishesPage/DishesPage";
import CartPage from "./pages/CartPage/CartPage";

const App = () => {
  // Get ImageKit URL endpoint from environment variable or use a default
  const imageKitUrlEndpoint = process.env.IMAGE_API || "https://ik.imagekit.io/default";

  return (
    <IKContext urlEndpoint={imageKitUrlEndpoint}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dishes" element={<DishesPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </BrowserRouter>
    </IKContext>
  );
};

export default App;
