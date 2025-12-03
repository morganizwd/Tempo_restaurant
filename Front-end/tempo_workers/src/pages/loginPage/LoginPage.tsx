import React, { useEffect, useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import "./loginPage.scss";
import { useGlobalStore } from "../../shared/state/globalStore";
import EmployeeType from "../../shared/types/employee";

const LoginPage = () => {
  const [loginData, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [waiter, setIsWaiter] = useState(false);
  const [cook, setIsCook] = useState(false);
  const [admin, setIsAdmin] = useState(false);
  const { login, currentUser } = useGlobalStore();

  useEffect(() => {
    if (currentUser != {} as EmployeeType && currentUser != null) {
      setIsWaiter(currentUser.waiter != null);
      setIsCook(currentUser.cook != null);
      setIsAdmin(currentUser.waiter == null && currentUser.cook === null);
    }
  }, [currentUser]);

  if (waiter) {
    return <Navigate to={`/WaiterPage`} />;
  }
  if (admin) {
    return <Navigate to={`/AdminPage`} />;
  }
  if (cook) {
    return <Navigate to={`/CookPage`} />;
  }

  const handleLoginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLogin(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData !== "" && password !== "") {
      login({ login: loginData, password: password });
    }
  };

  return (
    <Container fluid className="Container login-page">
      <div id="content">
        <div className="login-wallpaper">
          <div className="menu-board">
            <Form id="login-form" onSubmit={handleSubmit}>
              <h2 className="login-title">Вход для сотрудников</h2>
              <p className="login-subtitle">Войдите в систему</p>
          
          <Form.Group className="mb-3">
            <Form.Label>Логин</Form.Label>
            <Form.Control
              type="text"
              placeholder="Введите логин"
              value={loginData}
              onChange={handleLoginChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-100"
            disabled={!loginData || !password}
          >
            Войти
          </Button>
            </Form>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default LoginPage;
