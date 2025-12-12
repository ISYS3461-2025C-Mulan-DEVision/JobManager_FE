import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui";

type AppHeaderProps = {
    className?: string;
};

export default function AppHeader({ className }: AppHeaderProps) {
    const location = useLocation();

    const pathname = location.pathname;
    const onLogin = pathname === "/login";
    const onRegister = pathname === "/register";

    return (
        <header className={className ?? ""}>
            <div className="h-20 border-b border-gray-200 bg-white">
                <div className="mx-auto flex h-full max-w-6xl items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <img src="/logo/logo.png" alt="DEVision" className="h-14 w-auto" />
                        <div className="leading-tight">
                            <div className="text-sm font-semibold text-gray-900">DEVision</div>
                            <div className="text-xs text-gray-500">Company hiring portal</div>
                        </div>
                    </Link>

                    <nav className="flex items-center gap-3">
                        {!onLogin && (
                            <Link to="/login" className="inline-flex">
                                <Button variant="ghost">Log in</Button>
                            </Link>
                        )}
                        {!onRegister && (
                            <Link to="/register" className="inline-flex">
                                <Button>Get started</Button>
                            </Link>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
