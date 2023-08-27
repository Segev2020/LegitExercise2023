import { GitHub } from "@mui/icons-material";
import COLORS from "../../../shared/ui/Colors/colors";
export default function LegitSecurityOrg({ origin }) {
  return (
    <>
      <GitHub style={{ color: COLORS.TextPrimary }} /> {origin}
    </>
  );
}
