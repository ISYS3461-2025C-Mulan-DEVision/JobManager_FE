import { Routes } from "react-router-dom";
import AppLayout from "@/layout/AppLayout";
import { authRoutes, mainRoutes, jobRoutes } from "@/routes";

function App() {
    return (
        <AppLayout>
            <Routes>
                {mainRoutes}
                {authRoutes}
                {jobRoutes}
            </Routes>
        </AppLayout>
    );
}

export default App;
