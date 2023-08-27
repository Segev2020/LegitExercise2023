import styles from "./Greeting.module.css";

export default function Greeting({ user }) {
  return <div className={styles.greeting}>{`Welcome ${user?.fullName}!`}</div>;
}
