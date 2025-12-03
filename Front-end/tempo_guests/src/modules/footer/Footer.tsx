import React from "react";
import { HeartFill } from "react-bootstrap-icons";
import "./Footer.scss";

const Footer = () => {
  return (
    <div id="footer">
      <div className="footer-content">
        <span>Ресторан</span>
        <HeartFill className="footer-icon" />
        <span>Tempo</span>
      </div>
    </div>
  );
};

export default Footer;
