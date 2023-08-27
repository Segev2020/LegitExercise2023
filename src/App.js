import "./App.css";
import { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Layout from "./shared/ui/Layout/Layout";
import { AuthContext } from "./context/authCtx";
import LoginPage from "./pages/LoginPage";
import IssuesContextProvider from "./context/issuesCtx";
import IssuesPage from "./pages/IssuesPage";
import PageNotFound from "./pages/PageNotFound";

function App() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <div className="App">
      {isLoggedIn ? (
        <Router>
          <IssuesContextProvider>
            <Layout>
              <Routes>
                <Route path="/" exact element={<IssuesPage />} />
                <Route path="/Home" element={<IssuesPage />} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </Layout>
          </IssuesContextProvider>
        </Router>
      ) : (
        <LoginPage />
      )}
    </div>
  );
}

export default App;
