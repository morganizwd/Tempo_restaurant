import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/loginPage/LoginPage";
import MainAdminPage from "./pages/mainAdminPage/MainAdminPage";
import MainWaiterPage from "./pages/mainWaiterPage/MainWaiterPage";
import Header from "./modules/header/Header";
import Footer from "./modules/footer/Footer";
import { useGlobalStore } from "./shared/state/globalStore";

const App = () => {
  const { currentUser } = useGlobalStore();
  return (
    <div className="Container">
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        <Routes>
          <Route path="/AdminPage" element={currentUser ? (
            <MainAdminPage />
          ) : (
            <Navigate replace to={"/login"} />
          )} />
        </Routes>
        <Routes>
          <Route path="/WaiterPage" element={currentUser ? (
            <MainWaiterPage />
          ) : (
            <Navigate replace to={"/login"} />
          )} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
};

export default App;
