import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import Main from "./Main/Main";
import styles from "./Layout.module.css";

export default function Layout({ children }) {
  return (
    <div className={`${styles.container}`}>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </div>
  );
}
