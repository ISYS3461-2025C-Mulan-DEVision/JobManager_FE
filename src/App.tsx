import { Routes } from "react-router-dom";
import AppLayout from "@/layout/AppLayout";
import { authRoutes, mainRoutes, jobRoutes, applicantRoutes } from "@/routes";

function App() {
    return (
        <AppLayout>
            <Routes>
                {mainRoutes}
                {authRoutes}
                {jobRoutes}
                {applicantRoutes}
            </Routes>
        </AppLayout>
    );
}

export default App;
