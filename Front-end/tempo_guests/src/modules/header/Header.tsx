import React from "react";
import { Navbar, Container, Button } from "react-bootstrap";
import { EggFried, PersonCircle, BoxArrowRight } from "react-bootstrap-icons";
import "./Header.scss";
import { useGlobalStore } from "../../shared/state/globalStore";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { currentUser, logout } = useGlobalStore();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  return (
    <div id="header">
      <Navbar expand="lg" className="navbar">
        <Container fluid>
          <Navbar.Brand
            onClick={() => navigate("/login")}
            className="navbar-brand"
          >
            <EggFried className="logo-icon" />
            <span>Tempo</span>
          </Navbar.Brand>
          
          {currentUser && (
            <div className="header-actions">
              <div
                id="header_profile"
                onClick={() => navigate("/cart")}
              >
                <PersonCircle className="profile-icon" />
                <p>{currentUser.name}</p>
              </div>
              <Button
                variant="outline-light"
                size="sm"
                onClick={handleLogout}
                className="logout-btn"
              >
                <BoxArrowRight className="logout-icon" />
                <span className="logout-text">Выйти</span>
              </Button>
            </div>
          )}
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
