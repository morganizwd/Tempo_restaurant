import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/loginPage/LoginPage";
import MainAdminPage from "./pages/mainAdminPage/MainAdminPage";
import MainWaiterPage from "./pages/mainWaiterPage/MainWaiterPage";
import Header from "./modules/header/Header";
import Footer from "./modules/footer/Footer";
import { useGlobalStore } from "./shared/state/globalStore";
import MainCookPage from "./pages/mainCookPage/mainCookPage";
import PostPage from "./pages/postPage/PostPage";

const App = () => {
  const { currentUser } = useGlobalStore();
  return (
    <div className="Container">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/AdminPage" element={currentUser ? (
            <MainAdminPage />
          ) : (
            <Navigate replace to={"/login"} />
          )} />
          <Route path="/WaiterPage" element={currentUser ? (
            <MainWaiterPage />
          ) : (
            <Navigate replace to={"/login"} />
          )} />
          <Route path="/CookPage" element={currentUser ? (
            <MainCookPage />
          ) : (
            <Navigate replace to={"/login"} />
          )} />
          <Route path="/PostPage" element={currentUser ? (
            <PostPage />
          ) : (
            <Navigate replace to={"/login"} />
          )} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
