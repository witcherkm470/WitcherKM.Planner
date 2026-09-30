import "./App.css";

import {
    Navigate,
    Route,
    Routes
} from "react-router-dom";

import MainLayout from "./components/Layout/MainLayout.tsx";

import ProjectsPage from "./views/project/ProjectsPage.tsx";
import ProjectPage from "./views/project/ProjectPage.tsx";
import FeaturesPage from "./views/feature/FeaturesPage.tsx";
import IdeasPage from "./views/idea/IdeasPage.tsx";
import { TaskCardPage, TasksPage } from "./views/task/TasksPage.tsx";
import FeaturePage from "./views/feature/FeaturePage.tsx";

function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Navigate
                        to="/projects"
                        replace
                    />
                }
            />

            <Route element={<MainLayout/>}>
                <Route
                    path="/projects"
                    element={<ProjectsPage/>}
                />

                <Route
                    path="/projects/:projectId"
                    element={<ProjectPage/>}
                />

                <Route
                    path="/features"
                    element={<FeaturesPage/>}
                />

                <Route
                    path="/ideas"
                    element={<IdeasPage/>}
                />
                <Route path="/tasks" element={<TasksPage/>}/>
                <Route path="/tasks/:taskId" element={<TaskCardPage/>}/>
                <Route path="/features/:featureId" element={<FeaturePage/>}/>
            </Route>
        </Routes>
    );
}

export default App;
