import _ from "lodash";

const severityToNum = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
};

const maxSeverityNum = _.max(Object.values(severityToNum));

const issueSeverityOptions = Object.keys(severityToNum).reverse();

const compareSeverity = (a, b, key = (elem) => elem) => {
  const aSeverity = key(a);
  const bSeverity = key(b);
  const aSeverityNum = severityToNum[aSeverity] ?? maxSeverityNum + 1;
  const bSeverityNum = severityToNum[bSeverity] ?? maxSeverityNum + 1;
  return aSeverityNum - bSeverityNum;
};

export { severityToNum, issueSeverityOptions };
export default compareSeverity;
