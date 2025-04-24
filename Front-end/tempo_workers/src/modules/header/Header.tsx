import React from "react";
import "./Header.scss";
import LocalPizzaIcon from "@mui/icons-material/LocalPizza";
import { resetGlobalStore, useGlobalStore } from "../../shared/state/globalStore";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

const Header = () => {
  const {currentUser} = useGlobalStore();

  return (
    <div id="header">
      <LocalPizzaIcon id="logo" />
      {currentUser ? (
        <div
          id="header_profile"
          onClick={() => {
            resetGlobalStore();
          }}
        >
          <AccountCircleRoundedIcon id="icon" /> <p>Выйти</p>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Header;
