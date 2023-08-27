import { useNavigate } from "react-router-dom";
import styles from "./PageNotFound.module.css";

export default function PageNotFound() {
  const navigate = useNavigate();
  return (
    <div className="flx flx-col items-center justify-center w-100 h-100 gap-xxl">
      <div className="flx flx-col items-center justify-center w-100 h-fit gap-xxl">
        <h1 className={`${styles.title}`}>Something's wrong here.</h1>
        <p className={`${styles.info}`}>
          The page you are looking for doesn’t exist.
        </p>
        <a
          href="/Home"
          className={`${styles.anchor}`}
          onClick={(e) => {
            e.preventDefault();
            navigate("/Home");
          }}
        >
          Click here to get back on track
        </a>
      </div>
    </div>
  );
}
