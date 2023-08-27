import styles from "./Footer.module.css";
export default function Footer() {
  return (
    <footer className={`${styles.container}`}>
      {
        <div  className={`${styles.footer}`}>
          Created by Segev Sinay <span>&copy;</span> 2023
        </div>
      }
    </footer>
  );
}
