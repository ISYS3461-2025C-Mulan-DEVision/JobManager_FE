import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui";

type AuthenticatedHeaderProps = {
    className?: string;
};

// Company Dropdown Menu
interface CompanyDropdownProps {
    onSignOut: () => void;
}

const CompanyDropdown: React.FC<CompanyDropdownProps> = ({ onSignOut }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    C
                </div>
                <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                    </Link>
                    <hr className="my-1 border-gray-200" />
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            onSignOut();
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
};

export default function AuthenticatedHeader({ className }: AuthenticatedHeaderProps) {
    const location = useLocation();
    const navigate = useNavigate();

    // Check if user is authenticated (you can customize this logic)
    const isAuthenticated = !!localStorage.getItem("access_token");

    const pathname = location.pathname;
    const onLogin = pathname === "/login";
    const onRegister = pathname === "/register";

    const handleSignOut = () => {
        // Clear auth data
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("company_id");
        localStorage.removeItem("user_email");

        // Navigate to login
        navigate("/login");
    };

    // Navigation links for authenticated users
    const navLinks = [
        { label: "Home", path: "/" },
        { label: "Job Posts", path: "/jobs" },
        { label: "Applicants Search", path: "/applicants" },
    ];

    return (
        <header className={className ?? ""}>
            <div className="h-20 border-b border-gray-200 bg-white">
                <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
                    <div className="flex items-center gap-8">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3">
                            <img src="/logo/logo.png" alt="DEVision" className="h-12 w-auto" />
                            <div className="leading-tight">
                                <div className="text-sm font-semibold text-gray-900">DEVision</div>
                                <div className="text-xs text-gray-500">Company hiring portal</div>
                            </div>
                        </Link>

                        {/* Primary Navigation (for authenticated users) */}
                        {isAuthenticated && (
                            <nav className="hidden lg:flex items-center gap-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`px-3 py-2 text-sm rounded-lg transition-colors ${pathname === link.path
                                                ? "text-blue-600 bg-blue-50 font-medium"
                                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        )}
                    </div>

                    {/* Right side */}
                    <nav className="flex items-center gap-3">
                        {isAuthenticated ? (
                            <>
                                {/* Post Button */}
                                <Link to="/jobs/new">
                                    <Button size="sm">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            POST
                                        </span>
                                    </Button>
                                </Link>

                                {/* Company Dropdown */}
                                <CompanyDropdown onSignOut={handleSignOut} />
                            </>
                        ) : (
                            <>
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
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
