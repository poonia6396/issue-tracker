import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Container } from "react-bootstrap";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import CreateProjectPage from "./pages/CreateProjectPage";
import CreateIssuePage from "./pages/CreateIssuePage";
import IssueDetailsPage from "./pages/IssueDetailsPage";
import ProjectIssuesPage from "./pages/ProjectIssuesPage";
import PrivateRoute from "./components/PrivateRoute";
import CustomNavbar from "./components/CustomNavbar";
import CustomBreadcrumbs from "./components/CustomBreadcrumbs";
import ProjectsPage from "./pages/ProjectsPage";
import IssuesPage from "./pages/IssuesPage";

const App: React.FC = () => {
  return (
    <Router>
      <CustomNavbar />
      <Container style={{ marginTop: "70px" }}>
        <CustomBreadcrumbs />
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
            path="/project/:projectId"
            element={
              <PrivateRoute>
                <ProjectDetailsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/projects/"
            element={
              <PrivateRoute>
                <ProjectsPage />
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
            path="/issues/"
            element={
              <PrivateRoute>
                <IssuesPage />
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
      </Container>
    </Router>
  );
};

export default App;
