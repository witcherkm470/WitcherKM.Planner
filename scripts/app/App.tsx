import "./App.css";

import { Navigate, Route, Routes } from "react-router-dom";

import { RenderProjectsPage } from "./views/project/ProjectsPage.tsx";
import ProjectPage from "./views/project/ProjectPage.tsx";

function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={<Navigate to="/projects" replace />}
            />

            <Route
                path="/projects"
                element={<RenderProjectsPage />}
            />

            <Route
                path="/projects/:projectId"
                element={<ProjectPage />}
            />
        </Routes>
    );
}

export default App;
