import styles from "./Header.module.css";
import BaseAvatar from "../../Avatars/Avatar";
import Greeting from "../../Greeting/Greeting";
import { useContext } from "react";
import { AuthContext } from "../../../../context/authCtx";
import { IssuesContext } from "../../../../context/issuesCtx";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <header
      className={`${styles.header} flx items-center justify-center w-100 h-100`}
    >
      <div
        id="app-header-content"
        className={`${styles.container} flx items-center space-between w-100 h-100`}
      >
        <img
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/Home")}
          className={`${styles.logo}`}
          src="https://www.legitsecurity.com/hubfs/logos/legit%20security%20logo%20white%20letters.svg"
          alt="legit security logo white letters"
        />
        <div className={`flx h-100 item-centerjustify-start gap-s`}>
          <div className={`flx h-100 item-center justify-start gap-m`}>
            <BaseAvatar id="app-header-user-avatar" user={user} />
            <Greeting id="app-header-greeting" user={user} />
          </div>
        </div>
      </div>
    </header>
  );
}
