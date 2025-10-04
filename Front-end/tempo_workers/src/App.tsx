import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/loginPage/LoginPage";
import MainAdminPage from "./pages/mainAdminPage/MainAdminPage";
import MainWaiterPage from "./pages/mainWaiterPage/MainWaiterPage";
import Header from "./modules/header/Header";
import Footer from "./modules/footer/Footer";
import { useGlobalStore } from "./shared/state/globalStore";
import MainCookPage from "./pages/mainCookPage/MainCookPage";

const App = () => {
  const { currentUser } = useGlobalStore();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/AdminPage" element={currentUser ? (
          <MainAdminPage />
        ) : (
          <Navigate replace to={"/login"} />
        )} />
      </Routes>
      <Routes>
        <Route path="/login" element={<div className="Container">
          <Header /><LoginPage /><Footer />
        </div>} />
      </Routes>
      <Routes>
        <Route path="/WaiterPage" element={<div className="Container">
          <Header />{currentUser ? (
            <MainWaiterPage />
          ) : (
            <Navigate replace to={"/login"} />
          )}<Footer />
        </div>} />
        <Route path="/CookPage" element={<div className="Container">
          <Header />{currentUser ? (
            <MainCookPage />
          ) : (
            <Navigate replace to={"/login"} />
          )}<Footer />
        </div>} />
      </Routes>
      <Routes>
        <Route path="/" element={
          <Navigate replace to={"/login"} />} />
      </Routes>


    </BrowserRouter>

  );
};

export default App;
