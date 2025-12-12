import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import AppHeader from "./components/common/AppHeader";

function App() {
    return (
        <div className="min-h-screen bg-background">
            <AppHeader />
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegistrationPage />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
