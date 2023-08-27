import { createContext, useState } from "react";
import COLORS from "../shared/ui/Colors/colors";

const INITIAL_STATE = {
  isLoggedIn: true,
  user: {
    fullName: "Tony Stark",
    displayName: "TS",
    email: "LegitSec@gmail.com",
    bgcolor: COLORS.PRIMARY500,
    isActive: true,
    isAdmin: true,
    image: {
      src: "https://eyemartnepal.com/wp-content/uploads/2019/05/Screenshot_20200303-215853__01.jpg",
      alt: "Logged in user avatar",
    },
  },
};

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  // sorry guys, didn't had the time to add also login/logout but you get the idea... :)
  const [isLoggedIn, setIsLoggedIn] = useState(INITIAL_STATE.isLoggedIn);
  const [user, setUser] = useState(INITIAL_STATE.user);
  return (
    <AuthContext.Provider value={{ isLoggedIn, user }}>
      {children}
    </AuthContext.Provider>
  );
}
