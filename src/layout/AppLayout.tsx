import { ReactNode } from "react";
import AuthenticatedHeader from "@/components/common/AuthenticatedHeader";

interface AppLayoutProps {
    children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <AuthenticatedHeader />
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
};

export default AppLayout;
