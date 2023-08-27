import styles from "./IssueDetails.module.css";
export default function NoData() {
  return (
    <div
      className={`${styles.no_selection} flx flx-col items-center justify-center w-100 h-100 gap-xl`}
    >
      <img
        alt="no selection"
        src="https://www.legitsecurity.com/hs-fs/hubfs/LegitSecurity-Platform-Hero.png?width=1638&height=1128&name=LegitSecurity-Platform-Hero.png"
        width="200rem"
      />{" "}
      Click an issue for a detailed view
    </div>
  );
}
