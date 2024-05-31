import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CreateProjectPage from "./pages/CreateProjectPage";
import CreateIssuePage from "./pages/CreateIssuePage";
import IssueDetailsPage from "./pages/IssueDetailsPage";
import ProjectIssuesPage from "./pages/ProjectIssuesPage";
import PrivateRoute from "./components/PrivateRoute";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-project"
          element={
            <PrivateRoute>
              <CreateProjectPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/project/:projectId/issues/create"
          element={
            <PrivateRoute>
              <CreateIssuePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/project/:projectId/issues"
          element={
            <PrivateRoute>
              <ProjectIssuesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/issue/:issueId"
          element={
            <PrivateRoute>
              <IssueDetailsPage />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
