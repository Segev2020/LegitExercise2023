import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import CrisisAlertIcon from "@mui/icons-material/CrisisAlert";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import { CodeTwoTone } from "@mui/icons-material";
import GitHubIcon from "@mui/icons-material/GitHub";
import COLORS from "../Colors/colors";

export const ICON_TYPES = {
  CRITICAL_SEVERITY: "Critical",
  HIGH_SEVERITY: "High",
  MED_SEVERITY: "Medium",
  LOW_SEVERITY: "Low",
  SDLC: "SDLCMisconfiguration",
  CLOUD: "CloudMisconfiguration",
  CODE: "CodeHygiene",
  REPO: "Repository",
  RESOLVED: "Resolved",
  OPEN: "Open",
};

export const getChipsProps = (type) => {
  switch (type) {
    case ICON_TYPES.CRITICAL_SEVERITY:
      return {
        class: "high",
        icon: CrisisAlertIcon,
        label: ICON_TYPES.CRITICAL_SEVERITY,
        bgcolor: COLORS.DarkRed,
        color: COLORS.White,
      };
    case ICON_TYPES.HIGH_SEVERITY:
      return {
        class: "high",
        icon: OutlinedFlagIcon,
        label: ICON_TYPES.HIGH_SEVERITY,
        bgcolor: COLORS.Red,
        color: COLORS.White,
      };
    case ICON_TYPES.MED_SEVERITY:
      return {
        class: "medium",
        icon: OutlinedFlagIcon,
        label: ICON_TYPES.MED_SEVERITY,
        bgcolor: COLORS.Orange,
        color: COLORS.White,
      };
    case ICON_TYPES.LOW_SEVERITY:
      return {
        class: "medium",
        icon: OutlinedFlagIcon,
        label: ICON_TYPES.LOW_SEVERITY,
        bgcolor: COLORS.Green,
        color: COLORS.White,
      };
    case ICON_TYPES.SDLC:
      return {
        class: "sdlc",
        icon: AllInclusiveIcon,
        label: "SDLC Misconfigurations",
        bgcolor: COLORS.GRAY200,
        color: COLORS.TextPrimary,
      };
    case ICON_TYPES.CLOUD:
      return {
        class: "cloud",
        icon: CloudQueueIcon,
        label: "Cloud Misconfigurations",
        bgcolor: COLORS.GRAY200,
        color: COLORS.TextPrimary,
      };
    case ICON_TYPES.CODE:
      return {
        class: "cloud",
        icon: CodeTwoTone,
        label: "Code Hygiene",
        bgcolor: COLORS.GRAY200,
        color: COLORS.TextPrimary,
      };
    case ICON_TYPES.REPO:
      return {
        class: "git",
        icon: GitHubIcon,
        label: ICON_TYPES.REPO,
        bgcolor:COLORS.GRAY200,
        color: COLORS.TextPrimary,
      };
    case ICON_TYPES.RESOLVED:
      return {
        class: "git",
        icon: null,
        label: ICON_TYPES.RESOLVED,
        bgcolor: COLORS.GRAY200,
        color: COLORS.TextPrimary,
      };
    case ICON_TYPES.OPEN:
      return {
        class: "git",
        icon: null,
        label: ICON_TYPES.OPEN,
        bgcolor: COLORS.GRAY200,
        color: COLORS.TextPrimary,
      };
    default:
      return {
        class: "git",
        icon: null,
        label: ICON_TYPES.OPEN,
        bgcolor: COLORS.GRAY200,
        color: COLORS.TextPrimary,
      };
  }
};
