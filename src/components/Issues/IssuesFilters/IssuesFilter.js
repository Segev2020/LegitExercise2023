import styles from "./IssuesFilter.module.css";
import { useContext } from "react";
import { IssuesContext } from "../../../context/issuesCtx";
import BaseCard from "../../../shared/ui/Cards/BaseCard";
import MultiSelect from "../../../shared/ui/Inputs/MultiSelect";
import SearchIcon from "@mui/icons-material/Search";
import IconChips from "../../../shared/ui/Chips/IconChips";
import IconTextField from "../../../shared/ui/Inputs/IconTextField";

export default function IssuesFilter() {
  const {
    filters,
    activeFilters,
    setSearchVal,
    setActiveFilters,
    ISSUE_TYPES_STRING_MAP,
  } = useContext(IssuesContext);
  const handleSearch = (e) => {
    setSearchVal(e.target.value);
  };

  return (
    <BaseCard>
      <div
        id="issues-filter-container"
        className={`flx items-center justify-center w-100 h-100 pt-l pb-l`}
      >
        <div
          id="issues-filter-card"
          className={`${styles.card} flx flx-col items-start space-between h-100 w-100`}
        >
          <div
            id="issues-filter-title"
            className={`${styles.title} flx items-center justify-start gap-l`}
          >
            Filters
            {activeFilters && (
              <IconChips
                chips={[
                  ...activeFilters?.types,
                  ...activeFilters?.statuses,
                  ...activeFilters?.severities,
                ].map((filter) => {
                  return { type: filter };
                })}
                disableColors={true}
              />
            )}
          </div>
          <div
            id="issues-filter-filters-container"
            className={`${styles.content} flx items-end justify-start gap-l`}
          >
            <IconTextField
              placeholder="Free Search"
              onChange={handleSearch}
              leftIcon={
                <SearchIcon sx={{ fontSize: "2.2rem", color: "#98a2b3" }} />
              }
            />
            <MultiSelect
              label="Type"
              customDictionary={ISSUE_TYPES_STRING_MAP}
              options={filters?.types || []}
              callback={(data) => {
                setActiveFilters((prev) => {
                  return { ...prev, types: data };
                });
              }}
            />
            <MultiSelect
              label="Severity"
              customDictionary={ISSUE_TYPES_STRING_MAP}
              options={filters?.severities || []}
              callback={(data) => {
                setActiveFilters((prev) => {
                  return { ...prev, severities: data };
                });
              }}
            />
            <MultiSelect
              label="Status"
              customDictionary={ISSUE_TYPES_STRING_MAP}
              options={filters?.statuses || []}
              callback={(data) => {
                setActiveFilters((prev) => {
                  return { ...prev, statuses: data };
                });
              }}
            />
          </div>
        </div>
      </div>
    </BaseCard>
  );
}
