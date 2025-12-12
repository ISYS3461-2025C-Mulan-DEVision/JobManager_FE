import { Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";

function App() {
    const location = useLocation();
    const isAuthPage = location.pathname === "/login";

    return (
        <div>
            {!isAuthPage && (
                <nav className="p-4 bg-gray-800 text-white flex gap-4">
                    <Link to="/">Home</Link>
                    <Link to="/login">Login</Link>
                </nav>
            )}

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </div>
    );
}

export default App;
