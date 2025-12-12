import clsx from 'clsx';
import { ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
    sideContent?: ReactNode;
}

const AuthLayout = ({ children, sideContent }: AuthLayoutProps) => {
    const showSplitLayout = Boolean(sideContent);

    return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
            <main
                className={clsx(
                    'flex-1 flex px-4 py-12 items-center justify-center',
                    showSplitLayout && 'md:justify-between md:gap-12'
                )}
            >
                {showSplitLayout && (
                    <div className="hidden md:flex w-full md:w-1/2 items-center justify-start">
                        {sideContent}
                    </div>
                )}

                <div
                    className={clsx(
                        'flex w-full items-center',
                        showSplitLayout ? 'md:w-1/2 justify-end' : 'justify-center'
                    )}
                >
                    <div className="w-full max-w-xl md:max-w-none">
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            {children}
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-6 px-4">
                <div className="max-w-md mx-auto text-center">
                    <p className="text-sm text-gray-600">
                        © {new Date().getFullYear()} DEVision - Job Manager. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default AuthLayout;
