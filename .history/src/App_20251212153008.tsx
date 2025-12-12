import { Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import { Button } from "./components/ui";

function App() {
    const location = useLocation();
    const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

    return (
        <div className="min-h-screen bg-background">
            {!isAuthPage && (
                <header className="border-b border-gray-200 bg-white">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                        <Link to="/" className="flex items-center gap-3">
                            <img src="/logo/logo.png" alt="DEVision" className="h-9 w-auto" />
                            <div className="leading-tight">
                                <div className="text-sm font-semibold text-gray-900">DEVision</div>
                                <div className="text-xs text-gray-500">Company hiring portal</div>
                            </div>
                        </Link

                        <nav className="flex items-center gap-3">
                            <Link to="/login" className="inline-flex">
                                <Button variant="ghost">Log in</Button>
                            </Link>
                            <Link to="/register" className="inline-flex">
                                <Button>Get started</Button>
                            </Link>
                        </nav>
                    </div>
                </header>
            )}

            <main className={!isAuthPage ? "" : ""}>
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
