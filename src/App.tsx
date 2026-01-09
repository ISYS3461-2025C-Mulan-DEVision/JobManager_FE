import { Routes } from "react-router-dom";
import AppLayout from "@/layout/AppLayout";
import {
    authRoutes,
    mainRoutes,
    jobRoutes,
    applicantRoutes,
    applicationRoutes,
    subscriptionRoutes,
} from "@/routes";

function App() {
    return (
        <AppLayout>
            <Routes>
                {mainRoutes}
                {authRoutes}
                {jobRoutes}
                {applicantRoutes}
                {applicationRoutes}
                {subscriptionRoutes}
            </Routes>
        </AppLayout>
    );
}

export default App;
