import React from "react";
import { Navbar, Container } from "react-bootstrap";
import { EggFried, PersonCircle } from "react-bootstrap-icons";
import "./Header.scss";
import { resetGlobalStore, useGlobalStore } from "../../shared/state/globalStore";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { currentUser } = useGlobalStore();
  const navigate = useNavigate();

  return (
    <div id="header">
      <Navbar expand="lg" className="navbar">
        <Container fluid>
          <Navbar.Brand 
            onClick={() => navigate("/AdminPage")}
            className="navbar-brand"
          >
            <EggFried className="logo-icon" />
            <span>Tempo</span>
          </Navbar.Brand>
          
          {currentUser && (
            <div
              id="header_profile"
              onClick={() => {
                resetGlobalStore();
                navigate("/login");
              }}
            >
              <PersonCircle className="profile-icon" />
              <p>Выйти</p>
            </div>
          )}
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
