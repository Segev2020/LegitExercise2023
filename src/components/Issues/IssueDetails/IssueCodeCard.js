import styles from "./IssueDetails.module.css";
import BaseCard from "../../../shared/ui/Cards/BaseCard";
import GitBranch from "../../../shared/icons/git-branch-line.svg";
import GitCommit from "../../../shared/icons/git-commit-line.svg";
import ShareBox from "../../../shared/icons/share-box-fill.svg";
import COLORS from "../../../shared/ui/Colors/colors";
import Seperator from "../../../shared/ui/Seperator/Seperator";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  addDays,
  addHours,
} from "date-fns";
import CodeIcon from "@mui/icons-material/Code";

function calcDateDiff(startDate, endDate) {
  const deltaDays = differenceInDays(new Date(endDate), new Date(startDate));
  const deltaHours = differenceInHours(
    new Date(endDate),
    addDays(new Date(startDate), deltaDays)
  );
  const deltaMinutes = differenceInMinutes(
    new Date(endDate),
    addHours(addDays(new Date(startDate), deltaDays), deltaHours)
  );
  return `${deltaDays}d ${deltaHours}h:${deltaMinutes}`;
}

export default function IssueCodeCard({ selectedItemDetails }) {
  return (
    <>
      <div className="flx flx-col w-100 justify-start items-start gap-l">
        <div className="flx w-100 gap-s">
          <RemoveRedEyeOutlinedIcon />
          <div className={`${styles.boldtext}`}>{`Time Exposed:`}</div>
          {/* Ticket is exposed as long as its open (!)*/}
          {calcDateDiff(
            new Date(selectedItemDetails?.payload?.date),
            selectedItemDetails?.statusChangedAt
              ? new Date(selectedItemDetails?.statusChangedAt)
              : new Date()
          )}
        </div>
      </div>
      <Seperator />
      <div className={`${styles.code_container}`}>
        <BaseCard>
          <div className={`${styles.first_code_line} flx items-center gap-xl`}>
            <div className={` flx items-center gap-s`}>
              <CodeIcon style={{ color: COLORS.White }} />
              {selectedItemDetails?.payload?.file}
            </div>
            <div className={`flx items-center gap-s `}>
              <img src={GitBranch} width={"16px"} alt="branch icon" />
              {selectedItemDetails?.payload?.branch}
            </div>
            <div className={`flx items-center gap-s `}>
              <img src={GitCommit} width={"16px"} alt="commit icon" />
              {selectedItemDetails?.payload?.commit}
            </div>
            <img src={ShareBox} width={"16px"} alt="share box icon" />
          </div>
          <div>
            {selectedItemDetails?.payload?.line
              ?.split("--")
              .map((el, index) => (
                <div
                  className={`${styles.code_line} flx items-center pr-l pl-l gap-m`}
                  style={{
                    background: el.includes(
                      selectedItemDetails?.payload?.offender
                    )
                      ? COLORS.LightRed
                      : "",
                  }}
                >
                  <div className={`${styles.code}flx items-center p-xs gap-m`}>
                    {index + 1}
                  </div>
                  <code
                    className={`${styles.code} flx items-center p-xs gap-m`}
                  >
                    {el}
                  </code>
                </div>
              ))}
          </div>
        </BaseCard>
      </div>
      <Seperator />
    </>
  );
}
