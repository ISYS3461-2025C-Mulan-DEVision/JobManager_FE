import { Routes } from "react-router-dom";
import AppHeader from "./components/common/AppHeader";
import { authRoutes, mainRoutes } from "./routes";

function App() {
    return (
        <div className="min-h-screen bg-background">
            <AppHeader />
            <main>
                <Routes>
                    {mainRoutes}
                    {authRoutes}
                </Routes>
            </main>
        </div>
    );
}

export default App;
