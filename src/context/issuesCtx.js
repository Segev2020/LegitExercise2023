import { createContext } from "react";
import { useState, useEffect } from "react";
import { toPagedResult } from "../mock/mockUtils";

const BASE_URL = "http://localhost:3000/api/issues";

const ISSUE_TYPES_STRING_MAP = {
  CodeHygiene: "Code Hygiene",
  SDLCMisconfiguration: "SDLC Misconfiguration",
  CloudMisconfiguration: "Cloud Misconfiguration",
};

const INITAL_FILTERS = {
  types: [],
  severities: [],
  statuses: [],
};

export const IssuesContext = createContext();

export default function IssuesContextProvider({ children }) {
  const [issues, setIssues] = useState();
  const [activePage, setActivePage] = useState(1);
  const [activeFilters, setActiveFilters] = useState(INITAL_FILTERS);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);
  const [paginationData, setPaginationData] = useState();
  const [searchVal, setSearchVal] = useState(undefined);
  const [filters, setFilters] = useState(INITAL_FILTERS);

  useEffect(() => {
    const getIssues = async () => {
      let url = BASE_URL + `?pageNumber=${activePage}&pageSize=4`;
      if (searchVal) url += `&search=${searchVal}`;
      if (activeFilters?.types?.length > 0)
        url += `&issueType=${activeFilters?.types?.toString()}`;
      if (activeFilters?.severities?.length > 0)
        url += `&severity=${activeFilters?.severities?.toString()}`;
      if (activeFilters?.statuses?.length > 0)
        url += `&status=${activeFilters?.statuses?.toString()}`;
      const res = await fetch(url);
      const data = await res.json();
      setPaginationData(JSON.parse(res.headers.map["x-pagination"]));
      setIssues(
        data.map((el) => {
          return { ...el, read: false };
        })
      );
    };
    getIssues();
  }, [activeFilters, activePage, searchVal]);

  useEffect(() => {
    const getIssueDetails = async () => {
      let url = BASE_URL + `/${selectedItem.id}/detailed`;
      const res = await fetch(url);
      const data = await res.json();
      setSelectedItemDetails(data);
    };
    getIssueDetails();
  }, [selectedItem]);

  useEffect(() => {
    // so the filter will not be filtered which will not allow proper multi-selection
    if (
      filters.types?.length > 0 ||
      filters?.severities?.length > 0 ||
      filters?.statuses?.length > 0
    )
      return;
    let types = {};
    let severities = {};
    let statuses = {};
    issues?.forEach((issue) => {
      if (!types[issue.issueType]) {
        types[issue.issueType] = true;
      }
      if (!severities[issue.severity]) {
        severities[issue.severity] = true;
      }
      if (!statuses[issue.status]) {
        statuses[issue.status] = true;
      }
      setFilters({
        types: Object.keys(types),
        severities: Object.keys(severities),
        statuses: Object.keys(statuses),
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issues]);

  return (
    <IssuesContext.Provider
      value={{
        issues,
        filters,
        paginationData,
        activeFilters,
        selectedItem,
        selectedItemDetails,
        ISSUE_TYPES_STRING_MAP,
        setFilters,
        setActiveFilters,
        setIssues,
        setSelectedItem,
        setActivePage,
        setSearchVal,
      }}
    >
      {children}
    </IssuesContext.Provider>
  );
}
