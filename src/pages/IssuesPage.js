import styled from "./IssuesPage.module.css";
import IssuesFilter from "../components/Issues/IssuesFilters/IssuesFilter";
import IssuesList from "../components/Issues/IssuesList/IssuesList";
import IssueDetailsPane from "../components/Issues/IssueDetails/IssueDetailsPane";


export default function IssuesPage() {
  return (
    <div className={`${styled.container}`}>
      <div className={`${styled["top-container"]}`}>
        <IssuesFilter />
      </div>
      <div className={`${styled["bottom-container"]}`}>
        <IssuesList />
        <IssueDetailsPane />
      </div>
    </div>
  );
}
