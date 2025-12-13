import { ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Simple Header - Logo only */}
            <header className="py-6 px-8">
                <div className="flex items-center">
                    <img
                        src="/logo.png"
                        alt="JobManager Logo"
                        className="h-12 w-auto"
                    />
                </div>
            </header>

            {/* Centered Content Panel */}
            <main className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    {/* Card wrapper for the form */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        {children}
                    </div>s
                </div>
            </main>

            {/* Simple Footer - Copyright only */}
            <footer className="py-6 px-4">
                <div className="max-w-md mx-auto text-center">
                    <p className="text-sm text-gray-600">
                        © {new Date().getFullYear()} JobManager. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default AuthLayout;
