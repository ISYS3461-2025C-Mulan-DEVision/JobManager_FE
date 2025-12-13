import { Routes } from "react-router-dom";
import AppLayout from "@/layout/AppLayout";
import { authRoutes, mainRoutes } from "@/routes";

function App() {
    return (
        <AppLayout>
            <Routes>
                {mainRoutes}
                {authRoutes}
            </Routes>
        </AppLayout>
    );
}

export default App;
