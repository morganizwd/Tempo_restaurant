import React, { useEffect, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import PhoneInput from "react-phone-number-input";
import "./loginPage.scss";
import Header from "../../modules/header/Header";
import Footer from "../../modules/footer/Footer";
import { useGlobalStore } from "../../shared/state/globalStore";
import UserType from "../../shared/types/user";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { login, currentUser } = useGlobalStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser !== null) {
      navigate("/dishes");
    }
  }, [currentUser]);

  const [phone, setPhone] = useState<string>("");
  const [name, setName] = useState("");

  const handlePhoneChange = (value: string | undefined) => {
    setPhone(value || "");
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone && name) {
      login({ name: name, phone: phone } as UserType);
    }
  };

  const handleGuestLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({ name: "Гость", phone: "Гость" } as UserType);
  };

  return (
    <Container fluid className="Container login-page">
      <div id="content">
        <div className="login-wallpaper">
          <div className="menu-board">
            <Form id="login-form" onSubmit={handleLogin}>
              <h2 className="login-title">Добро пожаловать</h2>
              <p className="login-subtitle">Войдите, чтобы продолжить</p>
          
          <Form.Group className="mb-3">
            <Form.Label>Имя</Form.Label>
            <Form.Control
              type="text"
              placeholder="Введите ваше имя"
              value={name}
              onChange={handleNameChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Номер телефона</Form.Label>
            <div className="phone-input-wrapper">
              <PhoneInput
                international
                defaultCountry="BY"
                value={phone}
                onChange={handlePhoneChange}
                className="form-control"
                placeholder="Введите номер телефона"
              />
            </div>
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="mb-3"
            disabled={!phone || !name}
          >
            Войти
          </Button>
          
          <Button
            type="button"
            variant="outline-primary"
            size="lg"
            onClick={handleGuestLogin}
          >
            Войти как гость
          </Button>
            </Form>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default LoginPage;
