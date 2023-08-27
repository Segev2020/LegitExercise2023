import BaseCard from "../../../shared/ui/Cards/BaseCard";
import styles from "./IssueList.module.css";
import { useContext } from "react";
import { IssuesContext } from "../../../context/issuesCtx";
import IssueListItem from "./IssueListItem";
import { Pagination, PaginationItem } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { CircularProgress } from "@mui/material";
import COLORS from "../../../shared/ui/Colors/colors";

export default function IssuesList() {
  const { issues, paginationData, setActivePage } = useContext(IssuesContext);
  return (
    <BaseCard sx={{ minHeight: "fit-content" }}>
      <div
        className={`${styles.list_page_container} flx flx-col space-between h-100`}
      >
        {!issues && (
          <div
            id="issues-list-loader"
            className={`flx flx-col items-center justify-center gap-m h-100 w-100 ${styles.loading}`}
          >
            <CircularProgress style={{ color: COLORS.PRIMARY500 }} />
          </div>
        )}
        {issues && (
          <>
            <div>
              <div
                id="issues-list-counter"
                className={`${styles.counter}`}
              >{`${paginationData?.TotalCount} results`}</div>
              <div
                id="issues-list-container"
                className={`${styles.card} flx flx-col items-start h-100 w-100`}
              >
                {issues?.map((el, index) => (
                  <IssueListItem issue={el} key={el.id} />
                ))}
              </div>
            </div>
            <div id="issues-list-pagination" className={`${styles.paging}`}>
              <Pagination
                onChange={(event, value) => {
                  setActivePage(value);
                }}
                shape="rounded"
                count={paginationData?.TotalPages}
                size="small"
                renderItem={(item) => (
                  <PaginationItem
                    slots={{
                      previous: ArrowBackIosNewIcon,
                      next: ArrowForwardIosIcon,
                    }}
                    {...item}
                  />
                )}
              />
            </div>
          </>
        )}
      </div>
    </BaseCard>
  );
}
