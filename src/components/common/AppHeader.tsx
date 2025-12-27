import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui";
import { getStoredUser, clearAuthSession } from "../../services/authStorage";
import { useState, useEffect } from "react";
import {
    getCompanyProfile,
    getCompany,
} from "@/components/feature/CompanyProfile/api";

type AppHeaderProps = {
    className?: string;
};

export default function AppHeader({ className }: AppHeaderProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(getStoredUser());
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [companyLogoUrl, setCompanyLogoUrl] = useState<string | null>(null);
    const [companyName, setCompanyName] = useState<string | null>(null);

    const pathname = location.pathname;
    const onLogin = pathname === "/login";
    const onRegister = pathname === "/register";

    // Listen for auth changes
    useEffect(() => {
        const handleAuthChange = () => {
            setUser(getStoredUser());
            setIsDropdownOpen(false); // Close dropdown when auth state changes
        };

        window.addEventListener("auth-change", handleAuthChange);
        return () => {
            window.removeEventListener("auth-change", handleAuthChange);
        };
    }, []);

    // Reset dropdown state when user changes
    useEffect(() => {
        setIsDropdownOpen(false);
    }, [user]);

    // Fetch company logo and name when user is available
    useEffect(() => {
        const fetchCompanyData = async () => {
            if (user?.companyId) {
                try {
                    const [profile, company] = await Promise.all([
                        getCompanyProfile(),
                        getCompany(),
                    ]);
                    setCompanyLogoUrl(profile.logoUrl || null);
                    setCompanyName(company.name || null);
                } catch (error) {
                    console.error("Failed to fetch company data:", error);
                    setCompanyLogoUrl(null);
                    setCompanyName(null);
                }
            } else {
                setCompanyLogoUrl(null);
                setCompanyName(null);
            }
        };

        fetchCompanyData();
    }, [user]);

    const handleLogout = () => {
        clearAuthSession();
        setUser(null);
        navigate("/login");
    };

    return (
        <header className={className ?? ""}>
            <div className="h-20 border-b border-gray-200 bg-white">
                <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
                    <div className="flex items-center gap-8">
                        <Link
                            to={user ? "/dashboard" : "/"}
                            className="flex items-center gap-3"
                        >
                            <img
                                src="/logo/logo.png"
                                alt="DEVision"
                                className="h-12 w-auto"
                            />
                            <div className="leading-tight">
                                <div className="text-sm font-semibold text-gray-900">
                                    DEVision
                                </div>
                                <div className="text-xs text-gray-500">
                                    Company hiring portal
                                </div>
                            </div>
                        </Link>

                        {user && (
                            <nav className="hidden md:flex items-center gap-6">
                                <Link
                                    to="/dashboard"
                                    className="text-sm font-medium text-gray-700 hover:text-gray-900"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/job-posts"
                                    className="text-sm font-medium text-gray-700 hover:text-gray-900"
                                >
                                    Job Posts
                                </Link>
                                <Link
                                    to="/applicant-search"
                                    className="text-sm font-medium text-gray-700 hover:text-gray-900"
                                >
                                    Applicant Search
                                </Link>
                            </nav>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <div
                                    className="relative"
                                    onMouseEnter={() => setIsDropdownOpen(true)}
                                    onMouseLeave={() =>
                                        setIsDropdownOpen(false)
                                    }
                                >
                                    <div className="flex items-center gap-2 cursor-pointer">
                                        {companyLogoUrl ? (
                                            <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200">
                                                <img
                                                    src={companyLogoUrl}
                                                    alt="Company logo"
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                                                {user.email
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                        )}
                                    </div>

                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-0 pt-2 w-64 z-50">
                                            <div className="bg-white rounded-md shadow-lg py-1 border border-gray-100">
                                                <div className="px-4 py-3 border-b border-gray-100">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {companyName ||
                                                            user.email}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Subscription:{" "}
                                                        <span className="font-semibold text-blue-600">
                                                            Free
                                                        </span>
                                                    </p>
                                                </div>

                                                <Link
                                                    to="/profile"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                >
                                                    Profile Settings
                                                </Link>
                                                <Link
                                                    to="/notifications"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                >
                                                    Notifications
                                                </Link>
                                                <div className="border-t border-gray-100 my-1"></div>
                                                <button
                                                    onClick={handleLogout}
                                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                                                >
                                                    Log out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* <Button variant="primary">POST</Button> */}
                            </>
                        ) : (
                            <nav className="flex items-center gap-3">
                                {!onLogin && (
                                    <Link to="/login" className="inline-flex">
                                        <Button variant="ghost">Log in</Button>
                                    </Link>
                                )}
                                {!onRegister && (
                                    <Link
                                        to="/register"
                                        className="inline-flex"
                                    >
                                        <Button>Get started</Button>
                                    </Link>
                                )}
                            </nav>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
