import styles from "./IssueDetails.module.css";
import { useContext } from "react";
import { IssuesContext } from "../../../context/issuesCtx";
import BaseCard from "../../../shared/ui/Cards/BaseCard";
import NoData from "./NoData";
import Seperator from "../../../shared/ui/Seperator/Seperator";
import IssueCodeCard from "./IssueCodeCard";
import IssueDescription from "./IssueDescription";
import IssueTitle from "./IssueTitle";
import IssueDetailedTagChips from "./IsssueDetailsTagChips";
import IssueMetaData from "./IssueMetaData";
import IssueCompliance from "./IssueCompliance";
import IssueCommitedBy from "./IssueCommitedBy";

export const ISSUE_TYPES = {
  CODE: "CodeHygiene",
  SDLC: "SDLCMisconfiguration",
  CLOUD: "CloudMisconfiguration",
};

export default function IssueDetailsPane() {
  const { selectedItemDetails } = useContext(IssuesContext);
  return (
    <BaseCard>
      {!selectedItemDetails ? (
        <NoData />
      ) : (
        <div
          id="detailed-issue-details-container"
          className={`flx flx-col items-center justify-center h-100 w-100 p-m ${
            selectedItemDetails && styles.selected
          }`}
        >
          <div className={`flx flx-col items-start h-100 w-100 gap-l p-m`}>
            <IssueTitle selectedItemDetails={selectedItemDetails} />
            <IssueDetailedTagChips selectedItemDetails={selectedItemDetails} />
            <Seperator />
            <IssueMetaData selectedItemDetails={selectedItemDetails} />
            {ISSUE_TYPES.CLOUD === selectedItemDetails?.issueType && (
              <IssueDescription selectedItemDetails={selectedItemDetails} />
            )}
            <Seperator />
            {selectedItemDetails?.payload?.line && (
              <IssueCodeCard selectedItemDetails={selectedItemDetails} />
            )}
            <IssueCompliance selectedItemDetails={selectedItemDetails} />
            <Seperator />
            <IssueCommitedBy selectedItemDetails={selectedItemDetails} />
          </div>
        </div>
      )}
    </BaseCard>
  );
}
